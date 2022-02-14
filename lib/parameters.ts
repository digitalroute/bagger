import { ParameterObject, ParameterStyle, ReferenceObject, ExampleObject } from 'openapi3-ts';
import { Content, ContentSchemas } from './content';
import { Schema } from 'joi';
import { createSwaggerDefinition } from './utils/create_swagger_definition';

class BaggerContentDefinedForParameterError extends Error {}
class BaggerSchemaDefinedForParameterError extends Error {}

interface ExamplesObject {
  [param: string]: ExampleObject | ReferenceObject;
}

export type ParameterType = 'path' | 'query' | 'cookie' | 'header';

export class BaggerParameter {
  private settings: ParameterObject;
  private _content: Content = new Content();
  private _schema?: Schema;

  public constructor(type: ParameterType, name: string) {
    this.settings = { in: type, name };
  }

  /**
   * Returns the type of this parameter. E.g. where the parameter is located.
   */
  public getType(): ParameterType {
    return this.settings.in;
  }

  /**
   * Returns the name of this parameter.
   */
  public getName(): string {
    return this.settings.name;
  }

  /**
   * Describe the parameter.
   * @param description the description of the parameter.
   */
  public description(description: string): BaggerParameter {
    this.settings.description = description;
    return this;
  }

  /**
   * Marks if the parameter has to be present or not.
   * @param required if the parameter has to be present or not.
   */
  public required(required: boolean): BaggerParameter {
    this.settings.required = required;
    return this;
  }

  /**
   * Marks a parameer as deprecated if set to `true`
   * @param deprecated
   */
  public deprecated(deprecated: boolean): BaggerParameter {
    this.settings.deprecated = deprecated;
    return this;
  }

  /**
   * Query string parameters may only have a name and no value, like:
   * ```
   * GET /foo?metadata
   * ```
   *
   * This marks if an empty value is allowed or not.
   * @param allowEmptyValue if empty values are allowed.
   */
  public allowEmptyValue(allowEmptyValue: boolean): BaggerParameter {
    this.settings.allowEmptyValue = allowEmptyValue;
    return this;
  }

  /**
   * Parameters containing arrays and objects can be serialized in different ways. Style defines how multiple values are delimited.
   * @param style the style for delimiting parameter. Read more at: https://swagger.io/docs/specification/serialization/
   */
  public style(style: ParameterStyle): BaggerParameter {
    this.settings.style = style;
    return this;
  }

  /**
   * Parameters containing arrays and objects can be serialized in different ways.
   * Explode specifies whether arrays and objects should generate separate parameters for each array item or object property.
   * Read more at: https://swagger.io/docs/specification/serialization/
   * @param explode specifies whether arrays and objects should generate separate parameters for each array item or object property.
   */
  public explode(explode: boolean): BaggerParameter {
    this.settings.explode = explode;
    return this;
  }

  /**
   * [RFC 3986](https://tools.ietf.org/html/rfc3986#section-2.2) defines a set of reserved characters `:/?#[]@!$&'()*+,;=` that are used as URI component delimiters.
   * When these characters need to be used literally in a query parameter value, they are usually percent-encoded.
   * For example, `/` is encoded as `%2F` (or `%2f`), so that the parameter value `quotes/h2g2.txt` would be sent as:
   *
   * ```
   * GET /file?path=quotes%2Fh2g2.txt
   * ```
   *
   * @param allowReserved If you want a query parameter that is not percent-encoded, set allowReserved to `true`.
   */
  public allowReserved(allowReserved: boolean): BaggerParameter {
    this.settings.allowReserved = allowReserved;
    return this;
  }

  /**
   * To describe the parameter contents, you can use either the `schema()` or `addContent()` method.
   * They are mutually exclusive and used in different scenarios. In most cases, you would use `schema()`.
   * It lets you describe primitive values, as well as simple arrays and objects serialized into a string.
   * The serialization method for array and object parameters is defined by the `style()` and `explode() methods used in that parameter.
   * @param schema Describes the format of the parameter. Bagger uses joi schemas and translates them into OpenAPI 3 schemas.
   */
  public schema(schema: Schema): BaggerParameter {
    if (Object.keys(this._content.getSchemas()).length > 0) {
      throw new BaggerContentDefinedForParameterError();
    }
    this._schema = schema;
    return this;
  }

  /**
   * You can add examples to parameters to make OpenAPI specification of your web service clearer.
   * Examples can be read by tools and libraries that process your API in some way.
   * For example, an API mocking tool can use sample values to generate mock requests.
   * @param examples An object with Joi.Schema ([link](https://github.com/sideway/joi/blob/master/lib/index.d.ts#L745))
   */
  public examples(examples: ExamplesObject): BaggerParameter {
    this.settings.examples = examples;
    return this;
  }

  /**
   * To describe the parameter contents, you can use either the `schema()` or `addContent()` method.
   * They are mutually exclusive and used in different scenarios. In most cases, you would use `schema()`.
   * `addContent()` is used in complex serialization scenarios that are not covered by `style()` and `explode()`.
   * For example, if you need to send a JSON string in the query string like so:
   *
   * ```
   * filter={"type":"t-shirt","color":"blue"}
   * ```
   *
   * In this case you need to define the schema by using `addContent()` like this:
   *
   * ```js
   * const joi = require('joi')
   * parameter.addContent('application/json', joi.object().keys({
   *  type: joi.string(),
   *  color: joi.string()
   * }))
   * ```
   *
   * @param mediaType The media type of the body. Like 'application/json'
   * @param schema Describes the format of the parameter. Bagger uses joi schemas and translates them into OpenAPI 3 schemas.
   */
  public addContent(mediaType: string, schema: Schema): BaggerParameter {
    if (this.settings.schema) {
      throw new BaggerSchemaDefinedForParameterError();
    }
    this._content.add(mediaType, schema);
    return this;
  }

  /**
   * Returns the schema if there exists a schema.
   * @return `{ 'application/json': schema }`
   */
  public getSchemas(): ContentSchemas {
    if (this._schema) {
      return {
        'application/json': this._schema
      };
    }
    return this._content.getSchemas();
  }

  public compile(): ParameterObject {
    if (this._schema) {
      this.settings.schema = createSwaggerDefinition(this._schema);
    } else {
      this.settings.content = this._content.compile();
    }
    return this.settings;
  }
}

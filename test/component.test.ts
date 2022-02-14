import { bagger, joi } from '../lib';
import { BaggerSchemaComponent } from '../lib/component';

describe('Using components', () => {
  describe('Schema components', () => {
    test('Creating and compiling a schema component', () => {
      const schemaComponent = new BaggerSchemaComponent(
        'Person',
        joi.object().keys({
          name: joi.string().required(),
          age: joi.number().optional()
        })
      );

      expect(schemaComponent.compile()).toMatchSnapshot();
    });

    test('Components are added to the bagger configuration', () => {
      bagger.addComponent().schema(
        'Person',
        joi.object().keys({
          name: joi.string().required(),
          age: joi.number().optional()
        })
      );

      expect(bagger.compile()).toMatchSnapshot();
    });
  });
});

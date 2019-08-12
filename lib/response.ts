type Internals = {
  httpCode: number;
  description?: string;
}

export class BaggerResponse {
  public readonly isBagger = true;
  public internals: Internals;

  constructor(httpCode: number) {
    this.internals = {
      httpCode
    }
  }

  public description(description: string) {
    this.internals.description = description;
    return this;
  }

  public compile() {
    return ({
      [this.internals.httpCode]: {
        description: this.internals.description
      }
    })
  }
}

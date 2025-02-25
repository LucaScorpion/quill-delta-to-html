export abstract class Style {
  protected constructor(
    private readonly property: string,
    private readonly value: string,
  ) {}

  public getCss(): string {
    return `${this.property}: ${this.value};`;
  }
}

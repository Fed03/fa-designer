class CssExtractor {
  constructor(selector) {
    this.selector = selector;
  }

  rulesList() {
    return this.stylesheets.map(this.extractRules.bind(this)).flat();
  }

  get stylesheets() {
    return Array.from(document.styleSheets).filter(
      this.activeStylesheet.bind(this)
    );
  }

  activeStylesheet(sheet) {
    return !sheet.disabled && sheet.cssRules;
  }

  extractRules(sheet) {
    return this.rules(sheet)
      .filter(this.ruleContainingSelector.bind(this))
      .map(rule => rule.cssText);
  }

  ruleContainingSelector(rule) {
    return (
      rule instanceof CSSStyleRule && rule.selectorText.includes(this.selector)
    );
  }

  rules(sheet) {
    return Array.from(sheet.cssRules);
  }
}

export { CssExtractor };

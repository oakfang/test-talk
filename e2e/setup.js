expect.extend({
  async toBeVisible(received) {
    const elementHandle = await received;
    const pass = await elementHandle.evaluate((element) => {
      if (!element.ownerDocument || !element.ownerDocument.defaultView) {
        return true;
      }
      const style = element.ownerDocument.defaultView.getComputedStyle(element);
      if (!style || style.visibility === "hidden") {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (pass) {
      return {
        message: () => `expected element not to be visible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be visible`,
        pass: false,
      };
    }
  },
  async toHaveFocus(received) {
    const elementHandle = await received;
    const pass = await elementHandle.evaluate((element) => {
      return element.ownerDocument.activeElement === element;
    });
    if (pass) {
      return {
        message: () => `expected element not to be focused`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be focused`,
        pass: false,
      };
    }
  },
  async toHaveValue(received, expectedValue) {
    const elementHandle = await received;
    const actualValue = await elementHandle.evaluate(
      (element) => element.value
    );
    const pass =
      expectedValue !== undefined
        ? expectedValue === actualValue
        : !!actualValue;
    if (pass) {
      return {
        message: () =>
          `expected element not to have value${
            expectedValue !== undefined
              ? ` ${JSON.stringify(expectedValue)}`
              : ""
          }, but it had value: ${JSON.stringify(actualValue)}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected element to have value${
            expectedValue !== undefined
              ? ` ${JSON.stringify(expectedValue)}`
              : ""
          }, but it had value: ${JSON.stringify(actualValue)}`,
        pass: false,
      };
    }
  },
  async toBeDisabled(received) {
    const elementHandle = await received;
    const isDisabled = await elementHandle.evaluate(
      (element) => element.disabled
    );
    const pass = !!isDisabled;
    if (pass) {
      return {
        message: () => `expected element not to be disabled`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be disabled`,
        pass: false,
      };
    }
  },
  async toBeChecked(received) {
    const elementHandle = await received;
    const isChecked = await elementHandle.evaluate(
      (element) => element.checked
    );
    const pass = !!isChecked;
    if (pass) {
      return {
        message: () => `expected element not to be checked`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be checked`,
        pass: false,
      };
    }
  },
});

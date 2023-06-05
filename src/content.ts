const CLICK_DELAY_MS = 70;
const KEYBOARD_SHORTCUT_ATTRIBUTE = 'data-keyboardshortcut';

const sleep = async(ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const isDigit = (s: string): boolean =>/^\d$/.test(s);

const animateButtonClick = async (
  button: HTMLElement,
): Promise<void> => {
  button.style.transform = 'translateY(2px)';
  await sleep(CLICK_DELAY_MS);
  button.style.removeProperty('transform');
};

const handleMainControlClick = (
  mainControls: HTMLElement,
  buttonToClick: HTMLElement,
  event: KeyboardEvent,
): void => {
  const modeTabBar = buttonToClick.closest<HTMLElement>('.mode-tab-bar');
  // skip if the element is not visible
  if (!(mainControls.style.opacity !== '0') ||
    modeTabBar != null && !modeTabBar.classList.contains('visible')) {
    console.log(`ignoring ${event.key} due to element visibility`);
    return;
  }

  buttonToClick.click();
}

const handleButtonClick = (buttonToClick: HTMLElement, event: KeyboardEvent): void => {
  if (buttonToClick.classList.contains('hidden') || buttonToClick.closest('.hidden') != null) {
    console.log(`ignoring ${event.key} due to button visibility`);
    return;
  }

  animateButtonClick(buttonToClick)
    .then(() => buttonToClick.click())
}

document.addEventListener('keyup', async (event) => {
  const keyPressed = event.key.toUpperCase();
  const buttonToClick = document.querySelector<HTMLElement>(`[${KEYBOARD_SHORTCUT_ATTRIBUTE}="${keyPressed}"]`);
  if (buttonToClick != null) {
    const mainControls = buttonToClick.closest<HTMLDivElement>('.main-controls');
    if (mainControls != null) {
      handleMainControlClick(mainControls, buttonToClick, event);
    } else {
      handleButtonClick(buttonToClick, event);
    }
  }
});

// assigns key unless the key is already assigned to another element
const assignKeyShortcut = (element: HTMLElement, key: string) => {
  if (document.querySelector(`[${KEYBOARD_SHORTCUT_ATTRIBUTE}="${key}"]`) == null) {
    element.setAttribute(KEYBOARD_SHORTCUT_ATTRIBUTE, key);
    element.setAttribute('title', `Or press '${key}' on your keyboard`);
  } else {
    console.warn('got a conflict when assigning a keyboard shortcut', element);
  }
}

const assignMainControlsKeyboardShortcuts = (mainControls: HTMLElement) => {
  if (mainControls != null) {
    const leftHandButton = mainControls.querySelector('.hand-button .icon-hand-left')?.parentElement;
    if (leftHandButton != null) {
      assignKeyShortcut(leftHandButton, 'L');
    }

    const rightHandButton = mainControls.querySelector('.hand-button .icon-hand-right')?.parentElement;
    if (rightHandButton != null) {
      assignKeyShortcut(rightHandButton, 'R');
    }

    const flowModeButton = mainControls.querySelector('.icon-flow-mode')?.parentElement;
    if (flowModeButton != null) {
      assignKeyShortcut(flowModeButton, 'W');
    }

    const slowModeButton = mainControls.querySelector('.icon-slow-mode')?.parentElement;
    if (slowModeButton != null) {
      assignKeyShortcut(slowModeButton, '5');
    }

    const fastModeButton = mainControls.querySelector('.icon-fast-mode')?.parentElement;
    if (fastModeButton != null) {
      assignKeyShortcut(fastModeButton, '7');
    }
  }
}

const assignButtonKeyboardShortcut = (button: HTMLButtonElement | HTMLDivElement) => {
  const buttonTitle = button.innerText;
  if (buttonTitle.length > 0) {
    const key = button.innerText[0].toUpperCase();
    assignKeyShortcut(button, key)
  } else {
    console.log('button title missing. Cannot assign a keyboard shortcut', button);
  }
}

const observer = new MutationObserver((mutationList, _) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode instanceof Element) {
          if (addedNode.classList.contains('main-controls') && addedNode instanceof HTMLElement) {
            assignMainControlsKeyboardShortcuts(addedNode);
          } else if ([...addedNode.classList.values()].some(className => className.startsWith('css-'))) {
            addedNode.querySelectorAll<HTMLButtonElement>('button[data-testid="PrimaryButton"]').forEach((button) => {
              assignButtonKeyboardShortcut(button)
            });
          } else if (addedNode.classList.contains('learnstep-notification') || addedNode.classList.contains('centered-children')) {
            addedNode.querySelectorAll<HTMLDivElement>('.buttons > div.button').forEach((button) => {
              assignButtonKeyboardShortcut(button)
            });
          }
        }
      }
    }
  }
});

observer.observe(document.body, { attributes: false, childList: true, subtree: true });

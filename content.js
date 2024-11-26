hoverEvent = new MouseEvent("mouseover", {
  view: window,
  bubbles: true,
  cancelable: true,
});

const indexes = [0, 2, 5];
const languages = ["Albanian", "Afrikaans", "Abkhazian"];

window.addEventListener("load", async function () {
  const addLanguageButton = await retryOnFailure(
    () => document.getElementById("add-translations-button"),
    5,
    1
  );

  if (!addLanguageButton) {
    console.log("Failed to find add language button");
    return;
  }

  addLanguageButton.click();

  // Add languages, don't need to wait
  if (!(await addLanguages())) {
    console.log("Failed to add languages provided.");
    return;
  }

  // Need to wait before languages are added
  const rowContainers = await retryOnFailure(
    () =>
      document.querySelectorAll(
        "[id='row-container'][class=' style-scope ytgn-video-translation-row style-scope ytgn-video-translation-row']"
      ),
    5,
    2
  );

  if (!rowContainers) {
    console.log("Failed to select all row containers.");
    return;
  }

  // Add subtitles
  for (lang of languages) {
    if (!(await addSubtitles(lang, rowContainers))) {
      console.log("Failed to add subtitles");
      return;
    }
  }
});

async function addSubtitles(lang, rowContainers) {
  let languageContainer;
  for (var i = rowContainers.length >>> 0; i--; ) {
    if (rowContainers[i].innerText.includes(lang)) {
      languageContainer = rowContainers[i];
      break;
    }
  }

  const hoverContainer = await retryOnFailure(
    () => languageContainer.querySelector("#status-info"),
    5,
    2
  );

  if (!hoverContainer) {
    console.log(`${lang}: Failed to select hover container`);
    return false;
  }

  hoverContainer.dispatchEvent(hoverEvent);

  const addCaptionsButton = await retryOnFailure(
    () => document.getElementById("captions-add"),
    5,
    2
  );

  if (!addCaptionsButton) {
    console.log(`${lang}: Failed to find add captions button.`);
    return false;
  }

  addCaptionsButton.click();

  const autoTranslateButton = await retryOnFailure(
    () => document.getElementById("choose-auto-translate"),
    8,
    2
  );

  if (!autoTranslateButton) {
    console.log(`${lang}: Failed to find auto translate button`);
    return false;
  }

  autoTranslateButton.click();

  const publishButton = await retryOnFailure(
    () => document.getElementById("publish-button"),
    5,
    1
  );

  if (!publishButton) {
    console.log(`${lang}: Failed to find publish button`);
    return false;
  }

  const publishButtonActive = await retryOnFailure(
    () =>
      publishButton.querySelector(
        "[class='ytcp-button-shape-impl ytcp-button-shape-impl--filled ytcp-button-shape-impl--mono ytcp-button-shape-impl--size-m']"
      ),
    8,
    2
  );

  if (!publishButtonActive) {
    console.log(`${lang}: Failed to find activated publish button`);
    return false;
  }

  publishButtonActive.click();

  await wait(3);

  return true;
}

function wait(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function retryOnFailure(boolFunction, numberOfRetries, secondsToRetry) {
  let retryCount = 0;
  let result = boolFunction();

  while (!result && retryCount < numberOfRetries) {
    await wait(secondsToRetry);
    result = boolFunction();
    retryCount++;
  }

  return result;
}

async function addLanguages() {
  const numberOfRetries = 5;
  const secondsToRetry = 1;

  for (index of indexes) {
    const langOption = await retryOnFailure(
      () => document.getElementById("text-item-" + index),
      numberOfRetries,
      secondsToRetry
    );

    if (!langOption) {
      console.log(`Failed to find option ${index}`);
      return false;
    }

    langOption.click();
  }

  return true;
}

<script>
  import ChooseContract from "$lib/Form/ChooseContract.svelte";
  import Configure from "$lib/Form/Configure.svelte";
  import ReviewDeploy from "$lib/Form/ReviewDeploy.svelte";
  import Steps from "$lib/Form/Steps.svelte";

  let stepNames = ["Choose Contract", "Configure", "Review & Deploy"];

  let page = 0;
  let pages = [ChooseContract, Configure, ReviewDeploy];
  let pagesState = [{}, {}, {}];

  async function onSubmit(values) {
    console.log(values);
    if (page === pages.length - 1) {
      // On our final page, we transact with the smart contract factory
      return;
    } else {
      // If we're not on the last page, store our data and increase a step
      pagesState[page] = { ...pagesState[page], ...values };
      pagesState = pagesState; // Triggering update
      page += 1;
    }
  }

  function onBack(values) {
    if (page === 0) return;
    pagesState[page] = { ...pagesState[page], ...values };
    pagesState = pagesState; // Triggering update
    page -= 1;
  }
</script>

<div class="m-8">
  <Steps {stepNames} currentStep={page} />
  <svelte:component
    this={pages[page]}
    {onSubmit}
    {onBack}
    {pagesState}
    initialValues={pagesState[page]}
  />
</div>

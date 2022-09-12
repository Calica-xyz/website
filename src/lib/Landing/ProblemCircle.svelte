<script lang="ts">
  import Card from "$lib/Flowbite/Card.svelte";
  import { onMount } from "svelte";
  import { Calculator, Refresh, Search, Cash, UserGroup } from "svelte-heros";

  const problems = [
    {
      text: "Calculating complex revenue shares by hand",
      icon: Calculator,
    },
    {
      text: "Manually distributing revenue... forever",
      icon: Refresh,
    },
    {
      text: "Navigating etherscan to see your cashflow",
      icon: Search,
    },
    {
      text: "Generating financial reports for your business",
      icon: Cash,
    },
    {
      text: "Sharing payout data with your team",
      icon: UserGroup,
    },
  ];

  let visited = false;

  onMount(async () => {
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visited = true;
        }
      });
    });

    // Tell the observer which elements to track
    observer.observe(document.querySelector(".circle"));
  });
</script>

<div class:visited class="circle m-auto" style="--total: 5">
  <div id="man" class="absolute mr-4 mb-8 w-[12%] max-w-[100px]">
    <svg
      class="w-full h-auto"
      viewBox="0 0 200 572.42786176"
      xmlns="http://www.w3.org/2000/svg"
      data-name="Layer 1"
    >
      <path
        fill="#a0616a"
        d="m20.30974,195.95677a14.21117,14.21117 0 0 1 1.987,1.108l63.154,-26.954l2.253,-16.636l25.235,-0.155l-1.491,38.158l-83.357,22.047a14.94008,14.94008 0 0 1 -0.631,1.7a14.411,14.411 0 1 1 -7.151,-19.265l0.001,-0.003z"
        data-name="Path 552"
        id="ab0ed44f-d533-4992-a1b3-ca9ac72248ac-1572"
      />
      <path
        fill="#a0616a"
        d="m122.11574,541.71773l-17.263,0l-8.212,-66.584l25.477,0l-0.002,66.584z"
        data-name="Path 553"
        id="e96706e1-851e-4da2-ad9b-ad313a8c64fc-1573"
      />
      <path
        fill="#2f2e41"
        d="m92.52274,536.78574l33.292,0l0,20.955l-54.254,0a20.962,20.962 0 0 1 20.962,-20.962l0,0l0,0.007z"
        data-name="Path 554"
        id="b540b71d-0f03-4ed3-b276-b3415efc1443-1574"
      />
      <path
        fill="#a0616a"
        d="m189.25174,536.83977l-17.178,1.69l-14.7,-65.458l25.355,-2.491l6.523,66.259z"
        data-name="Path 555"
        id="b87c34d6-a0a3-40d8-a436-08cd71fc342e-1575"
      />
      <path
        fill="#2f2e41"
        d="m159.30774,534.83576l33.126,-3.263l2.054,20.857l-53.981,5.317a20.958,20.958 0 0 1 18.8,-22.911l0.001,0z"
        data-name="Path 556"
        id="bb56473f-8578-4371-8d17-16b3f8ffc95c-1576"
      />
      <circle
        fill="#a0616a"
        r="34.583"
        cy="48.26774"
        cx="126.92075"
        data-name="Ellipse 84"
        id="b06ede21-2df7-4399-95f3-667c473f6547"
      />
      <path
        fill="#2f2e41"
        d="m100.99474,528.25173a6.3,6.3 0 0 1 -6.217,-5.21c-8.929,-49.59 -38.141,-211.772 -38.84,-216.268a1.99063,1.99063 0 0 1 -0.023,-0.312l0,-12.09398a2.1,2.1 0 0 1 0.393,-1.228l3.858,-5.4a2.082,2.082 0 0 1 1.611,-0.88c22,-1.031 94.036,-4.054 97.516,0.294l0,0c3.495,4.365 2.253,17.611 1.971,20.22l0.014,0.272l32.366,206.98211a6.353,6.353 0 0 1 -5.233,7.23l-20.214,3.33a6.366,6.366 0 0 1 -7.076,-4.355c-6.252,-19.978 -27.216,-87.184 -34.482,-113.19a0.7,0.7 0 0 0 -1.381,0.2c0.363,24.79 1.24,88.036 1.549,109.881l0.032,2.353a6.362,6.362 0 0 1 -5.763,6.387l-19.492,1.766a5.8754,5.8754 0 0 1 -0.589,0.02187z"
        data-name="Path 557"
        id="e3edd339-fa60-4375-a5a7-b8711a5f77a0-1577"
      />
      <path
        fill="#1875b2"
        d="m104.97274,96.44975c-6.035,3.588 -9.647,10.18 -11.719,16.9a160.07254,160.07254 0 0 0 -6.877,38.241l-2.191,38.86l-27.113,103.028c23.5,19.883 37.053,15.363 68.686,-0.9s35.246,5.422 35.246,5.422l6.325,-87.663l9.037,-95.793a42.48654,42.48654 0 0 0 -6.846,-6.581a69.923,69.923 0 0 0 -59.761,-12.673l-4.787,1.159z"
        data-name="Path 99"
        id="fafafea0-d187-42ce-9adc-60692d5c21c2-1578"
      />
      <path
        fill="#a0616a"
        d="m96.16674,216.76375a14.82766,14.82766 0 0 1 2.112,0.986l62.447,-31.259l1.036,-16.933l25.759,-1.776l1.38,38.6l-83.45,27.6a14.784,14.784 0 1 1 -9.283,-17.223l-0.001,0.005z"
        data-name="Path 558"
        id="bcb42d09-5dc7-4cce-9178-bbabc9608de0-1579"
      />
      <path
        fill="#1875b2"
        d="m175.91674,114.97575c15.363,5.422 18.071,64.171 18.071,64.171c-18.075,-9.941 -39.765,6.326 -39.765,6.326s-4.518,-15.365 -9.941,-35.246a34.54,34.54 0 0 1 7.229,-32.535s9.041,-8.14098 24.406,-2.716z"
        data-name="Path 101"
        id="a6b68414-708f-47b2-ba8b-69f9e74523ce-1580"
      />
      <path
        fill="#2f2e41"
        d="m157.92374,57.41075c-4.309,-3.447 -10.187,2.816 -10.187,2.816l-3.447,-31.016s-21.543,2.581 -35.334,-0.862s-15.943,12.5 -15.943,12.5a110.65357,110.65357 0 0 1 -0.431,-19.391c0.862,-7.756 12.064,-15.512 31.885,-20.683s30.162,17.236 30.162,17.236c13.796,6.88902 7.609,42.85102 3.295,39.4z"
        data-name="Path 102"
        id="bcacc9ce-a4f2-4033-9198-64d9603f2d9b-1581"
      />
    </svg>
  </div>
  {#each problems as problem, i}
    <div class="stat" style="--i:{i + 1}">
      <Card
        id="problem-card"
        padding="none"
        class="problem-card w-[180px] p-4 pt-6 h-[100px] text-center"
      >
        <div
          class="absolute top-[-20px] bg-accent-100 p-2 rounded-md left-[40%] text-white"
        >
          <svelte:component this={problem.icon} />
        </div>
        <p class="card-text text-sm">{problem.text}</p>
      </Card>
    </div>
  {/each}
</div>

<div id="mobile-list" class="flex flex-col justify-center gap-4 hidden">
  {#each problems as problem}
    <Card>
      <div class="flex gap-6 items-center">
        <div class="bg-accent-100 text-white p-3 rounded-md">
          <svelte:component this={problem.icon} />
        </div>
        <p>{problem.text}</p>
      </div>
    </Card>
  {/each}
</div>

<style>
  .circle {
    display: grid;
    grid-template-areas: "layer";
    place-items: center;
    --radius: 0;
    width: 60vmin;
    height: 60vmin;
  }

  .stat {
    grid-area: layer;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: bold;
    font-size: 3vmin;
    --d: calc(var(--i) / var(--total));
    --r-offset: -0.25turn;
    --r-amount: 1turn;
    --r: calc((var(--r-amount) * var(--d)) + var(--r-offset));
    --transform: rotate(var(--r)) translate(var(--radius))
      rotate(calc(-1 * var(--r)));
    transform: var(--transform);
    transition: transform 1.5s ease-in-out;
  }

  .visited {
    --radius: 30vmin;
  }

  @media (max-width: 550px) {
    .circle {
      display: none;
    }

    #mobile-list {
      display: flex;
    }
  }
</style>

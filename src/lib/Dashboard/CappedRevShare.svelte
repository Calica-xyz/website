<script lang="ts">
  import TimelineItemHorizontal from "$lib/Flowbite/TimelineItemHorizontal.svelte";
  import Card from "$lib/Flowbite/Card.svelte";
  import { Calendar, Adjustments } from "svelte-heros";

  export let data: any;
  export let chain: string;

  let timelineItems2 = [
    {
      date: "February 2022",
      title: "Lorem ipsum dolor sit amet",
      href: "/",
      icon: Calendar,
      iconSize: 14,
      iconClass: "text-blue-700 dark:text-red-500",
      linkname: "Learn more",
      text: "Consectetur adipiscing elit. Aenean condimentum erat vitae elit convallis molestie. Maecenas felis nisl, semper vitae venenatis non",
    },
    {
      date: "March 2022",
      title: "Lorem ipsum dolor sit amet",
      icon: Adjustments,
      iconSize: 14,
      iconClass: "text-blue-700 dark:text-red-500",
      text: "Consectetur adipiscing elit. Aenean condimentum erat vitae elit convallis molestie. Maecenas felis nisl, semper vitae venenatis non",
    },
    {
      date: "February 2022",
      title: "Lorem ipsum dolor sit amet",
      icon: Calendar,
      iconSize: 14,
      iconClass: "text-blue-700 dark:text-red-500",
      text: "Consectetur adipiscing elit. Aenean condimentum erat vitae elit convallis molestie. Maecenas felis nisl, semper vitae venenatis non",
    },
  ];
</script>

<Card class={$$props.class}>
  <ol class="items-center sm:flex">
    <TimelineItemHorizontal timelineItems={timelineItems2} />
  </ol>
</Card>

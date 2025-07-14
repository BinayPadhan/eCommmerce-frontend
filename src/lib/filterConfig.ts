// lib/filterConfig.ts
export const filterConfig: Record<
  string,
  { title: string; options: string[] }[]
> = {
  "polos": [
    {
      title: "Size",
      options: [
        "XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 749 - Rs. 1106",
        "Rs. 1107 - Rs. 1464",
        "Rs. 1465 - Rs. 1822",
        "Rs. 1823 - Rs. 2180",
        "Rs. 2181 - Rs. 2538",
        "Rs. 2539 - Rs. 2898"
      ],
    },
  ],
  "shirts": [
    { title: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    {
      title: "Price",
      options: [
        "Rs. 799 - Rs. 1214",
        "Rs. 1215 - Rs. 1630",
        "Rs. 1631 - Rs. 2046",
        "Rs. 2047 - Rs. 2462",
        "Rs. 2463 - Rs. 2878",
        "Rs. 2879 - Rs. 3298",
      ],
    },
    { title: "Fit", options: ["Slim", "Regular", "Relaxed"] },
    { title: "Waist", options: ["28", "30", "32", "34"] },
  ],
  "oversized-t-shirts": [
    { title: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    {
      title: "Price",
      options: [
        "Rs. 799 - Rs. 1214",
        "Rs. 1215 - Rs. 1630",
        "Rs. 1631 - Rs. 2046",
        "Rs. 2047 - Rs. 2462",
        "Rs. 2463 - Rs. 2878",
        "Rs. 2879 - Rs. 3298",
      ],
    },
    { title: "Fit", options: ["Slim", "Regular", "Relaxed"] },
    { title: "Waist", options: ["28", "30", "32", "34"] },
  ],
  "all-bottoms": [
    {
      title: "Size",
      options: [
        "XS", "S", "M", "L", "XL", "XXL", "XXXL"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 799 - Rs. 1231",
        "Rs. 1232 - Rs. 1664",
        "Rs. 1665 - Rs. 2097",
        "Rs. 2098 - Rs. 2530",
        "Rs. 2531 - Rs. 2963",
        "Rs. 2964 - Rs. 3399"
      ],
    },
  ],
  "shorts": [
    {
      title: "Size",
      options: [
        "XS", "S", "M", "L", "XL", "XXL", "XXXL"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 799 - Rs. 1231",
        "Rs. 1232 - Rs. 1664",
        "Rs. 1665 - Rs. 2097",
        "Rs. 2098 - Rs. 2530",
        "Rs. 2531 - Rs. 2963",
        "Rs. 2964 - Rs. 3399"
      ],
    },
  ],
  "sneakers": [
    {
      title: "Size",
      options: [
        "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 999 - Rs. 1423",
        "Rs. 1424 - Rs. 1848",
        "Rs. 1849 - Rs. 2273",
        "Rs. 2274 - Rs. 2698",
        "Rs. 2699 - Rs. 3123",
        "Rs. 3124 - Rs. 3549"
      ],
    },
  ],
  "boxers": [
    {
      title: "Size",
      options: [
        "XS", "S", "M", "L", "XL", "XXL", "XXXL"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 399 - Rs. 473",
        "Rs. 474 - Rs. 549"
      ],
    },
  ],
  "slides": [
    {
      title: "Size",
      options: [
        "UK 6", "UK 7", "UK 8", "UK 9", "UK 10"
      ],
    },
    {
      title: "Prices",
      options: [
        "Rs. 849 - Rs. 1065",
        "Rs. 1066 - Rs. 1282",
        "Rs. 1283 - Rs. 1499"
      ],
    },
  ]
};

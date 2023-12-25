import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const foodSortList = [
  {
    id: 0,
    name: "Meat (육류)",
  },
  {
    id: 1,
    name: "Fruit (과일류)",
  },
  {
    id: 2,
    name: "Vegetable (채소류)",
  },
  {
    id: 3,
    name: "Sea Food (해산물)",
  },
  {
    id: 4,
    name: "Dairy (유제품)",
  },
  {
    id: 5,
    name: "Frozen Food (냉동식품)",
  },
  {
    id: 9,
    name: "Beverages (음료)",
  },
  {
    id: 9,
    name: "Processed Food (가공식품)",
  },
  {
    id: 10,
    name: "Condiment (케찹/소스/기름)",
  },
  {
    id: 10,
    name: "Baking & Spice (밀가루/설탕/소금)",
  },
  {
    id: 10,
    name: "Bread & Grain (빵/쌀)",
  },
  {
    id: 10,
    name: "Canned Goods (캔 식품)",
  },
  {
    id: 10,
    name: "Food Court (푸드코트)",
  },
  {
    id: 11,
    name: "Paper & Plastic (종이/플라스틱)",
  },
  {
    id: 11,
    name: "Tax (세금)",
  },
  {
    id: 11,
    name: "Wage (급여)",
  },
  {
    id: 12,
    name: "Operational Expense (운영비용)",
  },
  {
    id: 13,
    name: "Others (기타)",
  },
];

const topTabList = [
  "Overview",
  "Costco",
  "Restaurant Depo",
  "Sam's",
  "HEB",
  "H mart / Hana",
  "Texas Mutual Trading",
  "Ocean Group",
  "Employee",
  "Store",
  "Others",
];

const incomeTopTabList = [
  "Square",
  "Stripe",
  "DoorDash",
  "Uber",
  "Cash",
  "Others",
];

const yearList = [
  {
    id: 0,
    year: 2023,
  },
  {
    id: 1,
    year: 2024,
  },
  {
    id: 2,
    year: 2025,
  },
  {
    id: 3,
    year: 2026,
  },
  {
    id: 4,
    year: 2027,
  },
  {
    id: 5,
    year: 2028,
  },
  {
    id: 6,
    year: 2029,
  },
  {
    id: 7,
    year: 2030,
  },
  {
    id: 8,
    year: 2031,
  },
  {
    id: 9,
    year: 2032,
  },
  {
    id: 10,
    year: 2033,
  },
];

const navbarList = [
  {
    id: 0,
    name: "Table",
    icon: (
      <FontAwesomeIcon
        icon="fa-solid fa-table"
        style={{ marginLeft: "5px" }}
        // size="lg"
      />
    ),
  },
  {
    id: 1,
    name: "Dashboard",
    icon: (
      <FontAwesomeIcon
        icon="fa-solid fa-chart-line"
        style={{ marginLeft: "5px" }}
        // size="lg"
      />
    ),
  },
  // {
  //   id: 2,
  //   name: "Setting",
  //   icon: (
  //     <FontAwesomeIcon icon="fa-solid fa-gear" style={{ marginLeft: "5px" }} />
  //   ),
  // },
];

const incomeNavbarList = [
  {
    id: 0,
    name: "Card",
    icon: (
      <FontAwesomeIcon
        icon="fa-solid fa-table"
        style={{ marginLeft: "5px" }}
        // size="lg"
      />
    ),
  },
  {
    id: 1,
    name: "Dashboard",
    icon: (
      <FontAwesomeIcon
        icon="fa-solid fa-chart-line"
        style={{ marginLeft: "5px" }}
        // size="lg"
      />
    ),
  },
  {
    id: 2,
    name: "Report",
    icon: (
      <FontAwesomeIcon icon="fa-solid fa-file" style={{ marginLeft: "5px" }} />
    ),
  },
];

const sortBtnList = [
  {
    id: 0,
    name: "Date: 1 to 31",
  },
  {
    id: 1,
    name: "From: A to Z",
  },
  {
    id: 2,
    name: "Sort: A to Z",
  },
  {
    id: 3,
    name: "Category: A to Z",
  },
  {
    id: 4,
    name: "Amount: Low to High",
  },
  {
    id: 5,
    name: "Amount: High to Low",
  },
];

const selectMonthOptions = [
  {
    id: 0,
    name: "All (전체)",
    value: "All",
  },
  {
    id: 1,
    name: "January (1월)",
    value: "January",
  },
  {
    id: 2,
    name: "February (2월)",
    value: "February",
  },
  {
    id: 3,
    name: "March (3월)",
    value: "March",
  },
  {
    id: 4,
    name: "April (4월)",
    value: "April",
  },
  {
    id: 5,
    name: "May (5월)",
    value: "May",
  },
  {
    id: 6,
    name: "June (6월)",
    value: "June",
  },
  {
    id: 7,
    name: "July (7월)",
    value: "July",
  },
  {
    id: 8,
    name: "August (8월)",
    value: "August",
  },
  {
    id: 9,
    name: "September (9월)",
    value: "September",
  },
  {
    id: 10,
    name: "October (10월)",
    value: "October",
  },
  {
    id: 11,
    name: "November (11월)",
    value: "November",
  },
  {
    id: 12,
    name: "December (12월)",
    value: "December",
  },
];

export {
  foodSortList,
  topTabList,
  incomeTopTabList,
  yearList,
  sortBtnList,
  incomeNavbarList,
  navbarList,
  selectMonthOptions,
};

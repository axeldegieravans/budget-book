import { fireEvent, render, screen } from "@testing-library/react";

import { SearchFilterBar } from "@/components/transactions/search-filter-bar";
import { defaultTransactionFilters } from "@/lib/utils/filters";

describe("SearchFilterBar", () => {
  it("geeft filterwijzigingen door", () => {
    const onChange = jest.fn();

    render(
      <SearchFilterBar
        categories={[
          {
            id: "food",
            name: "Food",
            budget: 200,
            color: "#10b981",
            createdAt: "",
            updatedAt: "",
          },
        ]}
        filters={defaultTransactionFilters}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Zoek op titel of notities"), {
      target: { value: "pizza" },
    });

    expect(onChange).toHaveBeenCalledWith({
      ...defaultTransactionFilters,
      query: "pizza",
    });
  });
});

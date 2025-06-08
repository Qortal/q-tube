import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useMediaQuery,
} from "@mui/material";
import { StatsData } from "../../../components/StatsData.tsx";
import { categories, subCategories } from "../../../constants/Categories.ts";
import { smallScreenSizeString } from "../../../constants/Misc.ts";
import { useSidebarState } from "./SearchSidebar-State.ts";
import {
  FiltersCol,
  FiltersContainer,
  FiltersRadioButton,
  FiltersRow,
  FiltersSubContainer,
} from "./VideoList-styles.tsx";

export interface SearchSidebarProps {
  onReset: () => void;
}
export const SearchSidebar = ({ onReset }: SearchSidebarProps) => {
  const {
    filterSearch,
    filterName,
    filterType,
    setFilterSearch,
    handleInputKeyDown,
    setFilterName,
    selectedCategoryVideos,
    handleOptionCategoryChangeVideos,
    selectedSubCategoryVideos,
    handleOptionSubCategoryChangeVideos,
    setFilterType,
    onSearch
  } = useSidebarState();

  const filtersStyle = { width: "75px", marginRight: "10px" };
  const isScreenSmall = !useMediaQuery(`(min-width:600px)`);

  return (
    <Box
      sx={{
        marginLeft: "5px",
        marginRight: isScreenSmall ? "5px" : "0px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <FiltersContainer>
        <StatsData />
        <Input
          id="standard-adornment-name"
          onChange={e => {
            setFilterSearch(e.target.value);
          }}
          value={filterSearch}
          placeholder="Search"
          onKeyDown={handleInputKeyDown}
          sx={{
            borderBottom: "1px solid white",
            "&&:before": {
              borderBottom: "none",
            },
            "&&:after": {
              borderBottom: "none",
            },
            "&&:hover:before": {
              borderBottom: "none",
            },
            "&&.Mui-focused:before": {
              borderBottom: "none",
            },
            "&&.Mui-focused": {
              outline: "none",
            },
            fontSize: "18px",
          }}
        />
        <Input
          id="standard-adornment-name"
          onChange={e => {
            setFilterName(e.target.value);
          }}
          value={filterName}
          placeholder="User's Name (Exact)"
          onKeyDown={handleInputKeyDown}
          sx={{
            marginTop: "20px",
            borderBottom: "1px solid white",
            "&&:before": {
              borderBottom: "none",
            },
            "&&:after": {
              borderBottom: "none",
            },
            "&&:hover:before": {
              borderBottom: "none",
            },
            "&&.Mui-focused:before": {
              borderBottom: "none",
            },
            "&&.Mui-focused": {
              outline: "none",
            },
            fontSize: "18px",
          }}
        />

        <FiltersSubContainer>
          <FormControl sx={{ width: "98%", marginTop: "30px" }}>
            <Box
              sx={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
              }}
            >
              <FormControl fullWidth sx={{ marginBottom: 1 }}>
                <InputLabel
                  sx={{
                    fontSize: "16px",
                  }}
                  id="Category"
                >
                  Category
                </InputLabel>
                <Select
                  labelId="Category"
                  input={<OutlinedInput label="Category" />}
                  value={selectedCategoryVideos?.id || ""}
                  onChange={handleOptionCategoryChangeVideos}
                  sx={{
                    // Target the input field
                    ".MuiSelect-select": {
                      fontSize: "16px", // Change font size for the selected value
                      padding: "10px 5px 15px 15px;",
                    },
                    // Target the dropdown icon
                    ".MuiSelect-icon": {
                      fontSize: "20px", // Adjust if needed
                    },
                    // Target the dropdown menu
                    "& .MuiMenu-paper": {
                      ".MuiMenuItem-root": {
                        fontSize: "14px", // Change font size for the menu items
                      },
                    },
                  }}
                >
                  {categories.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedCategoryVideos &&
                subCategories[selectedCategoryVideos?.id] && (
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel
                      sx={{
                        fontSize: "16px",
                      }}
                      id="Sub-Category"
                    >
                      Sub-Category
                    </InputLabel>
                    <Select
                      labelId="Sub-Category"
                      input={<OutlinedInput label="Sub-Category" />}
                      value={selectedSubCategoryVideos?.id || ""}
                      onChange={e =>
                        handleOptionSubCategoryChangeVideos(
                          e,
                          subCategories[selectedCategoryVideos?.id]
                        )
                      }
                      sx={{
                        // Target the input field
                        ".MuiSelect-select": {
                          fontSize: "16px", // Change font size for the selected value
                          padding: "10px 5px 15px 15px;",
                        },
                        // Target the dropdown icon
                        ".MuiSelect-icon": {
                          fontSize: "20px", // Adjust if needed
                        },
                        // Target the dropdown menu
                        "& .MuiMenu-paper": {
                          ".MuiMenuItem-root": {
                            fontSize: "14px", // Change font size for the menu items
                          },
                        },
                      }}
                    >
                      {subCategories[selectedCategoryVideos.id].map(option => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
            </Box>
          </FormControl>
        </FiltersSubContainer>
        <FiltersSubContainer>
          <FiltersRow>
            <span style={filtersStyle}>Videos</span>
            <FiltersRadioButton
              checked={filterType === "videos"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilterType("videos");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </FiltersRow>
          <FiltersRow>
            <span style={filtersStyle}> Playlists</span>
            <FiltersRadioButton
              checked={filterType === "playlists"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFilterType("playlists");
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </FiltersRow>
        </FiltersSubContainer>

        <Button
          onClick={() => {
            onReset();
          }}
          sx={{
            marginTop: "20px",
            width: "80%",
            alignSelf: "center",
          }}
          variant="contained"
        >
          reset
        </Button>
        <Button
          onClick={() => {
            onSearch();
          }}
          sx={{
            marginTop: "20px",
            width: "80%",
            alignSelf: "center",
          }}
          variant="contained"
        >
          Search
        </Button>
      </FiltersContainer>
    </Box>
  );
};

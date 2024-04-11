//react
import { useEffect, useState, useRef, useCallback } from "react";

//fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
//mui
import {
  Slider,
  Input,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import { GetApiProductsParams, useGetApiProducts } from "../../API";

//state
import {
  useDataState,
  searchDataState,
  useSubmitDataState,
  submitDataState,
} from "../../state";

const SearchTable: React.FC = () => {
  const [value, setValue] = useState<number[]>([10, 10000]);
  const [bookSearch, setBookSearch] = useState<number>(10);
  const [isPhysicalBookChecked, setIsPhysicalBookChecked] =
    useState<boolean>(true);
  const [isEBookChecked, setIsEBookChecked] = useState<boolean>(true);
  const [detailsCategory, setDetailsCategory] = useState<number>(0);
  const { submitData, setSubmitData } = useSubmitDataState<submitDataState>(
    (state) => state
  );
  const { setSearchData } = useDataState<searchDataState>((state) => state);
  const formRef = useRef<HTMLFormElement>(null); // 創建一個ref表單對象

  // 使用生成的GET請求hook，並根據條件啟動請求
  const productData = useGetApiProducts(submitData);

  useEffect(() => {
    if (productData.data?.data) setSearchData(productData.data?.data);
  }, [productData.data?.data]);

  useEffect(() => {
    handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
  }, [detailsCategory]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表單的默認提交行為

    // 模擬表單數據的收集
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append("productDetailsCategoryId", detailsCategory.toString());
    // 這裡可以替換為發送數據到後端的代碼
    const apiParams: GetApiProductsParams = {
      // Keyword: formData.get("keyword")?.toString() || undefined,
      // BookSearch: formData.get("bookSearch")
      //     ? Number(formData.get("bookSearch"))
      //     : 10,
      PhysicalBook: formData.get("PhysicalBook") ? "on" : "no",
      EBook: formData.get("EBook") ? "on" : "no",
      PriceRangeStart: formData.get("PriceRangeStart")
        ? Number(formData.get("PriceRangeStart"))
        : 0,
      PriceRangeEnd: formData.get("PriceRangeEnd")
        ? Number(formData.get("PriceRangeEnd"))
        : 10000,
      ProductDetailsCategoryId: formData.get("productDetailsCategoryId")
        ? Number(formData.get("productDetailsCategoryId"))
        : 0,
      Page: formData.get("page") ? Number(formData.get("page")) : 1,
      pageSize: formData.get("pageSize") ? Number(formData.get("pageSize")) : 9,
    };
    //console.log(apiParams);
    const newSubmitData = { ...submitData, ...apiParams };
    setSubmitData(newSubmitData);
  };

  const handleButtonClick = (value: number) => {
    // 設置被點擊按鈕的值
    setDetailsCategory(value);
  };

  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - 10), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + 10)]);
    }
  };

  const handlePrice1InputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = [...value];
    newValue[0] = event.target.value === "" ? 0 : Number(event.target.value);
    setValue(newValue);
  };
  const handlePrice2InputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = [...value];
    newValue[1] = event.target.value === "" ? 0 : Number(event.target.value);
    setValue(newValue);
  };
  const handlePrice1Blur = () => {
    const newValue = [...value];
    if (value[0] < 10) {
      newValue[0] = 10;
      setValue(newValue);
    } else if (value[0] > 10000) {
      newValue[0] = 10000;
      setValue(newValue);
    }
    handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
  };
  const handlePrice2Blur = () => {
    const newValue = [...value];
    if (value[1] < 10) {
      newValue[1] = 10;
      setValue(newValue);
    } else if (value[1] > 10000) {
      newValue[1] = 10000;
      setValue(newValue);
    }
    handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
  };

  const handlePhysicalBookChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPhysicalBookChecked(event.target.checked);
    handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
  };
  const handleEBookChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEBookChecked(event.target.checked);
    handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
  };

  const handleMouseUp = useCallback(
    (event: MouseEvent) => {
      // 執行需要的操作
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
      window.removeEventListener("mouseup", handleMouseUp);
    },
    [submitData, setSubmitData]
  );

  // 定義 handleMouseDown
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      window.addEventListener("mouseup", handleMouseUp);
    },
    [handleMouseUp, submitData, setSubmitData]
  ); // 這裡把 handleMouseUp 作為依賴傳入

  return (
    <div className="sidebar">
      <div className="sidebar mb-48">
        <div className="sidebar-block">
          <div className="filters">
            <form ref={formRef} onSubmit={handleSubmit}>
              <hr />
              <div className="filter-block">
                <div className="title mb-32">
                  <h5>實體書/電子書</h5>
                  <i>
                    <FontAwesomeIcon icon={faMinus} />
                  </i>
                </div>
                <ul className="unstyled list">
                  <li className="mb-16">
                    <div className="filter-checkbox">
                      <input
                        type="checkbox"
                        name="PhysicalBook"
                        id="PhysicalBook"
                        checked={isPhysicalBookChecked}
                        onChange={handlePhysicalBookChange}
                      />
                      <label
                        htmlFor="PhysicalBook"
                        style={{ userSelect: "none" }}
                      >
                        實體書
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="filter-checkbox">
                      <input
                        type="checkbox"
                        name="EBook"
                        id="EBook"
                        checked={isEBookChecked}
                        onChange={handleEBookChange}
                      />
                      <label htmlFor="EBook" style={{ userSelect: "none" }}>
                        電子書
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <hr />
              <div className="filter-block">
                <div className="title mb-32">
                  <h5>價格範圍</h5>
                  <i>
                    <FontAwesomeIcon icon={faMinus} />
                  </i>
                </div>
                <div className="slider-track">
                  <div className="d-flex justify-content-between mb-4p">
                    <h5>
                      <Input
                        value={value[0]}
                        size="small"
                        name="PriceRangeStart"
                        onChange={handlePrice1InputChange}
                        onBlur={handlePrice1Blur}
                        inputProps={{
                          min: 0,
                          max: 10000,
                          type: "number",
                        }}
                        sx={{
                          userSelect: "none",
                          "&:after": {
                            // 聚焦時的底線顏色
                            borderBottomColor: "#EAA451", // 更改為你想要的顏色
                          },
                        }}
                      />
                      <span className="me-1" style={{ userSelect: "none" }}>
                        元
                      </span>
                    </h5>
                    <h5>
                      <Input
                        value={value[1]}
                        size="small"
                        name="PriceRangeEnd"
                        onChange={handlePrice2InputChange}
                        onBlur={handlePrice2Blur}
                        inputProps={{
                          min: 0,
                          max: 10000,
                          type: "number",
                        }}
                        sx={{
                          serSelect: "none",
                          "&:after": {
                            // 聚焦時的底線顏色
                            borderBottomColor: "#EAA451", // 更改為你想要的顏色
                          },
                        }}
                      />
                      <span className="me-1" style={{ userSelect: "none" }}>
                        元
                      </span>
                    </h5>
                  </div>
                  <Slider
                    value={value}
                    onChange={handleChange}
                    onMouseDown={handleMouseDown}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    disableSwap
                    style={{ color: "#EAA451" }}
                  />

                  {/* <input type="text" className="js-slider form-control" value="0" /> */}
                </div>
              </div>
              <hr />
              <div className="filter-block">
                <div className="title mb-32">
                  <h5>書籍分類</h5>
                  {detailsCategory != 0 && (
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        className="cus-btn small invert"
                        style={{
                          paddingRight: "8px",
                          margin: "0px",
                          marginLeft: "80px",
                          borderRadius: "8px",
                          height: "30px",
                          boxShadow: "0px 4px 5px 0px rgba(211, 49, 49,0.3)",
                        }}
                        onClick={() => handleButtonClick(0)}
                      >
                        取消
                      </button>
                    </div>
                  )}
                  <i>
                    <FontAwesomeIcon icon={faMinus} />
                  </i>
                </div>
                <ul className="unstyled list">
                  {productData.data?.data.productDetailsCategories &&
                    productData.data?.data.productDetailsCategories.map(
                      (oneDetailsCategory) => {
                        return oneDetailsCategory.id != detailsCategory ? (
                          <li key={oneDetailsCategory.id} className="mb-8">
                            <button
                              type="submit"
                              className="cus-btn small invert"
                              style={{
                                paddingRight: "8px",
                                margin: "0px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                // boxShadow: "0px 4px 5px 0px #EAA451",
                                boxShadow:
                                  "0px 4px 5px 0px rgba(234, 166, 83, 0.3)",
                              }}
                              onClick={() =>
                                handleButtonClick(
                                  oneDetailsCategory.id as number
                                )
                              }
                            >
                              {oneDetailsCategory.name}
                            </button>
                          </li>
                        ) : (
                          <li key={oneDetailsCategory.id} className="mb-8">
                            <button
                              type="submit"
                              className="cus-btn small invert"
                              style={{
                                paddingRight: "8px",
                                margin: "0px",
                                marginBottom: "16px",
                                borderRadius: "8px",
                                boxShadow:
                                  "0px 4px 5px 0px rgba(47, 127, 51,0.3)",
                              }}
                              onClick={() =>
                                handleButtonClick(
                                  oneDetailsCategory.id as number
                                )
                              }
                            >
                              {oneDetailsCategory.name}
                            </button>
                          </li>
                        );
                      }
                    )}
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTable;

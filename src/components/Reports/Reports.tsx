import React, { useEffect } from "react";
import "./Reports.css";
import {
  Card,
  Grid,
  Col,
  AreaChart,
  BarChart,
  DonutChart,
  Title,
  DateRangePicker,
  DateRangePickerValue,
  SearchSelect,
  SearchSelectItem,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  List,
  ListItem,
  Divider,
} from "@tremor/react";
import { useState } from "react";
import {
  UserIcon,
  PresentationChartLineIcon,
  ChartBarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/solid";
import NoDataToShow from "./NoDataToShow";
import SparkChartKPICard from "./SparkChartKPICard";
import GetAllDrivers from "../../routes/driverDetails";
import GetAllRevenueData from "../../routes/reports";
import {
  GetRevenuePerMileData,
  GetNumberOfMiles,
  GetLoadCount,
  GetExpenses,
} from "../../routes/reports";

const Reports: React.FC = () => {
  const [driver, setDriver] = useState("");
  const [drivers, setDrivers] = useState<string[]>([]);
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 30);
  const [date, setDate] = useState<DateRangePickerValue>({
    to: new Date(),
    from: fromDate,
  });
  const [revenueOverTimeChartData, setRevenueOverTimeChartData] = useState([]);
  const [revenuePerMileChartData, setRevenuePerMileChartData] = useState<
    Object[]
  >([]);
  const [revenuePerMileKpiCardData, setRevenuePerMileKpiCardData] =
    useState<any>({});
  const [totalMilesChartData, setTotalMilesChartData] = useState<Object[]>([]);
  const [totalMilesKpiCardData, setTotalMilesKpiCardData] = useState<any>({});
  const [totalLoadsChartData, setTotalLoadsChartData] = useState<Object[]>([]);
  const [totalLoadsKpiCardData, setTotalLoadsKpiCardData] = useState<any>({});
  const [categories, setCategories] = useState<string[]>(["Cumulative"]);
  const [expenses, setExpenses] = useState<Object[]>([]);
  const [barChartToolTip, setBarChartToolTip] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const valueFormatter = function (number: number) {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
  };

  const fetchAllDrivers = async () => {
    try {
      const driverList = await GetAllDrivers();

      if (driverList) {
        const driverNames = driverList.map((driver) => driver.name);
        setDrivers(driverNames);
      }
    } catch (error) {}
  };

  const fetchRevenueOverTimeChartData = async () => {
    try {
      const driverRevenueData = await GetAllRevenueData(driver, date);

      if (driverRevenueData) {
        setRevenueOverTimeChartData(driverRevenueData);
        if (driver.length > 0) {
          setCategories([driver]);
        } else {
          setCategories(["Cumulative"]);
        }
      }
    } catch (error) {}
  };

  const fetchRevenuePerMileChartData = async () => {
    try {
      const driverRevenuePerMileData = await GetRevenuePerMileData(
        driver,
        date
      );

      if (driverRevenuePerMileData) {
        setRevenuePerMileChartData(driverRevenuePerMileData);

        const first_value = driverRevenuePerMileData[0]["Revenue per mile"];
        const last_value =
          driverRevenuePerMileData[driverRevenuePerMileData.length - 1][
            "Revenue per mile"
          ];
        const _change = Math.round(
          ((last_value - first_value) / last_value) * 100
        );
        const change = _change > 0 ? `+${_change}%` : `${_change}%`;
        const changeType = _change > 0 ? "positive" : "negative";
        let revenue = 0;
        let miles = 0;
        driverRevenuePerMileData.map((r: any) => {
          revenue = revenue + r.revenue;
          miles = miles + r.miles;
        });

        const kpiCardData = {
          name: "Revenue per mile",
          value: valueFormatter(
            Math.round((revenue / miles + Number.EPSILON) * 100) / 100
          ),
          change: change,
          changeType: changeType,
        };
        setRevenuePerMileKpiCardData(kpiCardData);
      }
    } catch (error) {}
  };

  const fetchNumberOfMilesChartData = async () => {
    try {
      const driverNumberOfMilesData = await GetNumberOfMiles(driver, date);

      if (driverNumberOfMilesData) {
        setTotalMilesChartData(driverNumberOfMilesData);

        const first_value = driverNumberOfMilesData[0].Miles;
        const last_value =
          driverNumberOfMilesData[driverNumberOfMilesData.length - 1].Miles;
        const _change = Math.round(
          ((last_value - first_value) / last_value) * 100
        );
        const change = _change > 0 ? `+${_change}%` : `${_change}%`;
        const changeType = _change > 0 ? "positive" : "negative";
        let value = 0;
        driverNumberOfMilesData.map((r: any) => {
          value = value + r.Miles;
        });

        const kpiCardData = {
          name: "Total miles",
          value: Math.round(value * 10) / 10,
          change: change,
          changeType: changeType,
        };
        setTotalMilesKpiCardData(kpiCardData);
      }
    } catch (error) {}
  };

  const fetchLoadCountChartData = async () => {
    try {
      const loadCountData = await GetLoadCount(driver, date);

      if (loadCountData) {
        setTotalLoadsChartData(loadCountData);

        const first_value = loadCountData[0].Loads;
        const last_value = loadCountData[loadCountData.length - 1].Loads;
        const _change = Math.round(
          ((last_value - first_value) / last_value) * 100
        );
        const change = _change > 0 ? `+${_change}%` : `${_change}%`;
        const changeType = _change > 0 ? "positive" : "negative";
        let value = 0;
        loadCountData.map((r: any) => {
          value = value + r.Loads;
        });

        const kpiCardData = {
          name: "Total loads",
          value: value,
          change: change,
          changeType: changeType,
        };
        setTotalLoadsKpiCardData(kpiCardData);
      }
    } catch (error) {}
  };

  const fetchExpenses = async () => {
    try {
      const _expenses = await GetExpenses(date);

      if (_expenses) {
        setExpenses(_expenses);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchAllDrivers();
    fetchRevenueOverTimeChartData();
    fetchRevenuePerMileChartData();
    fetchNumberOfMilesChartData();
    fetchLoadCountChartData();
    fetchExpenses();
  }, [driver, date]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div>
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-1">
        <DateRangePicker
          className="DateRangePicker min-w-sm"
          value={date}
          onValueChange={setDate}
        />
        <div className="max-w-sm mx-auto space-y-6">
          <SearchSelect
            value={driver}
            onValueChange={setDriver}
            placeholder="Filter by driver"
            icon={UserIcon}
          >
            {drivers.map((d) => (
              <SearchSelectItem
                className="cursor-pointer"
                key={d}
                value={d}
                icon={UserIcon}
              />
            ))}
          </SearchSelect>
        </div>
      </Grid>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-3 mt-6">
        <Col numColSpan={1} numColSpanLg={2}>
          <Card className="p-1.5 bg-gray-50 rounded-xl shadow-xl min-h-full dark:shadow-slate-950 dark:shadow-xl">
            <Card className="rounded-md min-h-full">
              <Title>Revenue over time</Title>
              <TabGroup>
                <TabList>
                  <Tab
                    icon={PresentationChartLineIcon}
                    className="ui-selected:!text-[#6686DC] ui-selected:!border-[#6686DC]"
                  ></Tab>
                  <Tab
                    icon={ChartBarIcon}
                    className="ui-selected:!text-[#6686DC] ui-selected:!border-[#6686DC]"
                  ></Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    {isLoading ? (
                      <div
                        role="status"
                        className="flex items-center justify-center h-96 max-w bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                      >
                        <PresentationChartLineIcon
                          className="w-10 h-10 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                        />

                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {revenueOverTimeChartData.length > 0 ? (
                          <div>
                            <AreaChart
                              className="h-96 mt-3"
                              data={revenueOverTimeChartData}
                              index="date"
                              yAxisWidth={65}
                              categories={categories}
                              colors={["#6686DC"]}
                              valueFormatter={valueFormatter}
                              showAnimation={true}
                              animationDuration={1500}
                              curveType="monotone"
                            />
                            <div className="h-2"></div>
                          </div>
                        ) : (
                          <NoDataToShow />
                        )}
                      </>
                    )}
                  </TabPanel>
                  <TabPanel>
                    {isLoading ? (
                      <div
                        role="status"
                        className="flex items-center justify-center h-56 max-w-lg bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
                      >
                        <PresentationChartLineIcon
                          className="w-10 h-10 text-gray-200 dark:text-gray-600"
                          aria-hidden="true"
                        />

                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {revenueOverTimeChartData.length > 0 ? (
                          <div>
                            <BarChart
                              className="h-96 mt-3"
                              data={revenueOverTimeChartData}
                              index="date"
                              yAxisWidth={65}
                              categories={categories}
                              colors={["#6686DC"]}
                              valueFormatter={valueFormatter}
                              showAnimation={true}
                              animationDuration={1500}
                              onValueChange={(v: any) => setBarChartToolTip(v)}
                            />
                            <div className="h-2"></div>
                          </div>
                        ) : (
                          <NoDataToShow />
                        )}
                      </>
                    )}
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </Card>
          </Card>
        </Col>
        <Card className="p-1.5 bg-gray-50 rounded-xl shadow-xl dark:shadow-slate-950 dark:shadow-xl">
          <Card className="rounded-md min-h-full">
            <Title>Total expenses by category</Title>
            {isLoading ? (
              <div
                role="status"
                className="flex items-center justify-center mt-16 mx-auto h-52 w-52 bg-gray-300 rounded-full animate-pulse dark:bg-gray-700"
              >
                <ChartPieIcon
                  className="w-10 h-10 text-gray-200 dark:text-gray-600"
                  aria-hidden="true"
                />
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <DonutChart
                className="mt-16 h-52"
                data={expenses}
                category="amount"
                index="name"
                valueFormatter={valueFormatter}
                showTooltip={true}
                colors={["cyan", "#6686DC", "fuchsia"]}
              />
            )}
            <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
              <span>Category</span>
              <span>Amount / Share</span>
            </p>
            <List className="mt-2">
              {isLoading ? (
                <div className="flex flex-col justify-center animate-pulse gap-2 mt-4">
                  <div className="flex items-center mt-1">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                    <div className="w-32 main-button h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <Divider className="mt-2 mb-2" />

                  <div className="flex items-center">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                    <div className="w-32 h-2 main-button bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <Divider className="mt-2 mb-2" />

                  <div className="flex items-center">
                    <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                    <div className="w-32 h-2 main-button bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                </div>
              ) : (
                expenses.map((item: any, index: number) => (
                  <ListItem key={item.name} className="space-x-6">
                    <div className="flex items-center space-x-2.5 truncate">
                      <span
                        className={classNames(
                          item.color,
                          "w-1 h-5 shrink-0 rounded"
                        )}
                        aria-hidden={true}
                      />
                      <span className="truncate dark:text-dark-tremor-content-emphasis">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                        {valueFormatter(item.amount)}
                      </span>
                      <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                        {item.share}
                      </span>
                    </div>
                  </ListItem>
                ))
              )}
            </List>
          </Card>
        </Card>
        <SparkChartKPICard
          kpiCardData={revenuePerMileKpiCardData}
          chartData={revenuePerMileChartData}
          categories={["Revenue per mile"]}
        />
        <SparkChartKPICard
          kpiCardData={totalMilesKpiCardData}
          chartData={totalMilesChartData}
          categories={["Miles"]}
        />
        <SparkChartKPICard
          kpiCardData={totalLoadsKpiCardData}
          chartData={totalLoadsChartData}
          categories={["Loads"]}
        />
      </Grid>
    </div>
  );
};

export default Reports;

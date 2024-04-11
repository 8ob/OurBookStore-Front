/*TestingData.tsx*/
import {Tabulator} from "react-tabulator/lib/types/TabulatorTypes";
import CellComponent = Tabulator.CellComponent;

export const data = [
    {
        "couponID": 1,
        "promotionID": 1,
        "code": "Pure10off",
        "startDate": "2024-02-01T00:00:00",
        "endDate": "2025-02-01T00:00:00",
        "valid": false,
        "description": "純粹只有10塊錢的折扣",
        "availabilityCount": 100,
        "usingStatus": "已過期",
        "minimumValue": 100,
        "discountValue": 10,
        "discountLimit": 10000,
        "couponTypeId": 1,
        "couponRedemptions": [],
        "couponType": null
    },
    {
        "couponID": 2,
        "promotionID": 2,
        "code": "wow100off",
        "startDate": "2024-02-10T00:00:00",
        "endDate": "2024-05-10T00:00:00",
        "valid": false,
        "description": "小促銷但有100",
        "availabilityCount": 10,
        "usingStatus": "已使用",
        "minimumValue": 1000,
        "discountValue": 100,
        "discountLimit": 10000,
        "couponTypeId": 1,
        "couponRedemptions": [],
        "couponType": null
    },
    {
        "couponID": 23,
        "promotionID": 2,
        "code": "free10",
        "startDate": "2024-02-10T00:00:00",
        "endDate": "2024-05-10T00:00:00",
        "valid": false,
        "description": "10塊的快樂",
        "availabilityCount": 10,
        "usingStatus": "已使用",
        "minimumValue": 1000,
        "discountValue": 10,
        "discountLimit": 10000,
        "couponTypeId": 1,
        "couponRedemptions": [],
        "couponType": null
    },
    {
        "couponID": 25,
        "promotionID": 1,
        "code": "string",
        "startDate": "2024-04-06T19:02:39.947",
        "endDate": "2024-04-06T19:02:39.947",
        "valid": false,
        "description": "25塊錢欸",
        "availabilityCount": 100,
        "usingStatus": "已過期",
        "minimumValue": 0,
        "discountValue": 10,
        "discountLimit": 10000,
        "couponTypeId": 1,
        "couponRedemptions": [],
        "couponType": null
    },
];

type SorterType = "string" | "number" | "boolean" | "time" | "alphanum" | "exists" | "date" | "datetime";

interface Column {
    title: string;
    field: string;
    sorter: SorterType;
    formatter?: (cell: CellComponent) => string;
}

export const columns: Column[] = [
    // { title: '序號ID', field: 'couponId', sorter: 'number' },
    { title: '序號', field: 'code', sorter: 'string' },
    { title: '是否有效', field: 'valid', sorter: 'boolean', formatter: (cell: CellComponent) => (cell.getValue() ? '可用' : '無效') },
    { title: '折扣面額', field: 'discountValue', sorter: 'number' },
    { title: '使用狀況', field: 'usingStatus', sorter: 'string' },
    // { title: '數量', field: 'availabilityCount', sorter: 'number' },
    // { title: '最小金額', field: 'minimumValue', sorter: 'number' },
    // { title: '折扣上限', field: 'discountLimit', sorter: 'number' },
    { title: '開始日期', field: 'startDate', sorter: 'string' },
    { title: '結束日期', field: 'endDate', sorter: 'string' },
    { title: '敘述', field: 'description', sorter: 'string' },
    { title: '折扣類型', field: 'couponTypeId', sorter: 'number' },
    //讓折扣類型依照數值不同而顯示不同的東西 1=定額折價 2=比例折扣 3=免運費
];

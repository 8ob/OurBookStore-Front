// CouponOverview.tsx
import React, { useState } from 'react';
import ClassTable from './ClassTable';
import './CouponOverview.css';

export interface CouponOverviewProps {
    colMap?: Record<string, string>;
}

const defaultColMap = {
    usingStatus: '使用狀況',
    couponID: '編號',
    promotionID: '活動代號',
    code: '優惠代碼',
    description: '敘述',
    valid: '是否可用',
    availabilityCount: '數量上限',
    discountValue: '折扣金額',
    minimumValue: '最低金額',
    discountLimit: '折扣上限',
    couponTypeId: '優惠券類型',
    startDate: '開始日期',
    endDate: '結束日期',
};

const CouponOverview: React.FC<CouponOverviewProps> = ({ colMap = defaultColMap }) => {
    const [sql, setSql] = useState('');
    const [usingStatus, setUsingStatus] = useState('');
    const [valid, setValid] = useState('');
    const [couponTypeId, setCouponTypeId] = useState('');

    const handleSearch = () => {
        const queryItems = [];

        if (usingStatus) {
            queryItems.push(`UsingStatus = '${usingStatus}'`);
        }

        if (valid) {
            queryItems.push(`Valid = ${valid}`);
        }

        if (couponTypeId) {
            queryItems.push(`CouponTypeId = ${couponTypeId}`);
        }

        const sqlQuery = `SELECT * FROM Coupons${
            queryItems.length > 0 ? ` WHERE ${queryItems.join(' AND ')}` : ''
        }`;
        setSql(sqlQuery);
    };

    return (
        <div className="coupon-overview">
            <div className="search-form">
                <label>
                    使用狀況：
                    <select value={usingStatus} onChange={(e) => setUsingStatus(e.target.value)}>
                        <option value="">全部</option>
                        <option value="已使用">已使用</option>
                        <option value="未使用">未使用</option>
                        <option value="已過期">已過期</option>
                    </select>
                </label>
                <label>
                    是否可用：
                    <select value={valid} onChange={(e) => setValid(e.target.value)}>
                        <option value="">全部</option>
                        <option value="1">可用</option>
                        <option value="0">不可用</option>
                    </select>
                </label>
                <label>
                    優惠券類型：
                    <select value={couponTypeId} onChange={(e) => setCouponTypeId(e.target.value)}>
                        <option value="">全部</option>
                        <option value="1">折扣券</option>
                        <option value="2">滿減券</option>
                        <option value="3">免運券</option>
                    </select>
                </label>
                <button onClick={handleSearch}>搜尋</button>
            </div>
            <ClassTable sql={sql} colMap={colMap} />
        </div>
    );
};

export default CouponOverview;
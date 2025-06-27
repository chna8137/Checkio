import React, { useState } from 'react'
import BigCalendar from './BigCalendar'
import styles from './a.module.css';

const AttendanceManage: React.FC = () => {
    return (
        <form className={styles.form}>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold' }}>월간 일정</p>
                <div style={{ margin: 'auto', width: '100%', height: '50vh' }}>
                    <BigCalendar />
                </div>
            </div>
        </form>
    )
}

export default AttendanceManage
import React, { useEffect, useState } from 'react'
import ReactDOM from "react-dom";
import { CalendarEvent, CalendarModalData } from './eventsData';
import styles from './modal.module.css';

interface ownProps {
  open: boolean;
  onClose: VoidFunction;
  calenderModalData: CalendarEvent;
  CalenderDataSelect: CalendarModalData[];
}

const CalendarModal = ({
  open,
  onClose,
  calenderModalData,
  CalenderDataSelect
}:ownProps) => {
    const [modalData, setModalData] = useState<CalendarEvent>();

    useEffect(() => {
        if(calenderModalData) {
            setModalData(calenderModalData);
        }
    }, [calenderModalData]);

    if (!open) return null;

    const portalElement = document.getElementById("modal");
    if (!portalElement) return null;

    return ReactDOM.createPortal(
        <>
            <div className={styles.overlay} />
            <div className={styles.calendarModal} style={{display:'flex', justifyContent:'space-around', alignItems:'center'}}>
                <div>
                    <table className="table table-hover">
                        <tbody>
                        <tr>
                            <th><label>구분 :</label></th>
                            <td>{modalData?.title}</td>
                        </tr>
                        <tr>
                            <th><label>기간 :</label></th>
                            <td>{modalData?.start.toLocaleString()} ~ {modalData?.end.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th><label>내용 :</label></th>
                            <td>{modalData?.desc}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>
                            <label style={{color:'red', fontSize:'0.8rem'}}>※시작시간은 휴게시간 1시간 이후 시간을 작성</label>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div>
                    <button className='btn btn-secondary' onClick={onClose}>닫기</button>
                </div>
            </div>
        </>,
        portalElement
    )
}

export default CalendarModal
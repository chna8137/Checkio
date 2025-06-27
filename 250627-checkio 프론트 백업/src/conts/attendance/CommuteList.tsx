import React, { useState } from 'react';
import { sampleData } from './CommuteData';
import styles from './a.module.css';
import OvertimeModal from './OvertimeModal';

const CommuteList: React.FC = () => {
    const [isModal, setIsModal] = useState(false);

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <>
        <form className={styles.form} onSubmit={handleSubmit}>
            <p style={{ fontWeight: 'bold'}}>출/퇴근 이력</p>
            <div style={{ width: '100%', textAlign: 'right' }}>
                <button className='btn btn-secondary' onClick={() => setIsModal(true)}>초과근무신청</button>
                <OvertimeModal open={isModal} onClose={() => {setIsModal(false)}} />
            </div>
            <div>
                <table className="table table-striped" style={{ textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th scope="col">이름</th>
                            <th scope="col">일자</th>
                            <th scope="col">출근시간</th>
                            <th scope="col">퇴근시간</th>
                            <th scope="col">지각</th>
                            <th scope="col">초과근무</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sampleData.map((item) => (
                                <tr key={item.id}>
                                    <th scope="row">{item.name}</th>
                                    <td>{item.date}</td>
                                    <td>{item.gowork}</td>
                                    <td>{item.leavework}</td>
                                    <td>{item.perception}</td>
                                    <td>{item.overtime}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
            </div>
        </form>
        <div id="modal"></div>
        </>
    )
}

export default CommuteList
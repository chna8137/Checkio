import React, { useState } from 'react'
import Modal from './OvertimeModal';

const OvertimeRequest: React.FC = () => {
    const [isModal, setIsModal] = useState(false);
    return (
        <div>
            <button onClick={() => setIsModal(true)}>초과근무신청</button>
            <Modal open={isModal} onClose={() => setIsModal(false)} />
        </div>
    )
}

export default OvertimeRequest
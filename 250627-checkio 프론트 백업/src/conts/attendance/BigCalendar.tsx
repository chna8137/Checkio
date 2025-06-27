import { ko } from 'date-fns/locale';
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { Calendar, dateFnsLocalizer, Views} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMemo, useState } from 'react';
import { CalendarEvent, eventsData } from './eventsData'
import CalendarModal from './CalendarModal';


const BigCalendar: React.FC = (props) => {
    const locales = { ko };
    const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
    //modal
    const [isModal, setIsModal] = useState(false);
    const handleUpdateOpen = () => setIsModal(true);
    const [calenderModalData, setCalenderModalData] = useState<CalendarEvent>(); //모달에 넣을 데이터

    const { defaultDate} = useMemo(() => {
        return { 
            defaultDate: new Date()
        };
    }, []);

    const modalHandle = (event: any) => {
        //console.log(event);
        setCalenderModalData(event); //모달에 넣을 데이터
        //console.log(calenderModalData);
        handleUpdateOpen();
  };

    // 일정에 따른 스타일 동적으로 적용
    const handleEventPropGetter = (event:{type:string}) => {
        let backgroundColor = '';

        switch (event.type) {
        case 'vacation':
            backgroundColor = '#ad3b31';
            break;
        case 'businessTrip':
            backgroundColor = '#3174ad';
            break;
        case 'workingOutside':
            backgroundColor = '#317474';
            break;
        default:
            backgroundColor = '#465660';
        }

        return {
            style: {
                backgroundColor,
                color: 'white',
                borderRadius: '5px',
                border: 'none',
                display: 'block'
            }
        }   
    };

    return (
        <>
        <div style={{width:'100%', height: '100%' }}>
            <Calendar
                selectable
                defaultDate={defaultDate} /* 캘린더가 로드될 때 보여줄 날짜*/
                localizer={localizer}
                defaultView={Views.MONTH} /* 기본 보기모드(월) */
                events={eventsData} /* 캘린더에 표기할 일정 */
                eventPropGetter={handleEventPropGetter} /* 일정의 스타일을 동적으로 적용 */
                startAccessor='start'
                endAccessor='end'
                step={30} /* 30분 간격 */
                timeslots={2} /* 2개의 슬롯으로 간격 */
                style={{ height: '100%', fontSize: '0.8rem' }} /* 캘린더 전체의 스타일 정의 */
                views={['month', 'week']} /* 보기모드의 종류 */
                onSelectEvent={modalHandle}
            />
            {calenderModalData && (
            <CalendarModal
                open={isModal}
                onClose={() => setIsModal(false)}
                calenderModalData={calenderModalData}
                CalenderDataSelect={eventsData} //데이터 조회
                />
            )}
        </div>
        <div id="modal"></div>
        </>
    );
}

export default BigCalendar
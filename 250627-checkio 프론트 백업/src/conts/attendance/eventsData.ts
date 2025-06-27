export interface CalendarEvent {
  id: number;
  title: string;
  allDay: boolean;
  start: Date;
  end: Date;
  desc: string;
  resourceId?: string;
  tooltip?: string;
  userId: string;
  calenderType: number;
}

export interface CalendarModalData {
  id: number;
  title: string;
  start: Date;
  end: Date;
  calendarType: number;
}

export const eventsData = [
  {
    id: 1,
    title: '연차',
    start: new Date('2025-6-4'),
    end: new Date('2025-6-4'),
    calendarType: 0,
    desc: '개인사유로 휴가신청합니다.',
    type: 'vacation'
  },
  {
    id: 2,
    title: '출장',
    start: new Date('2025-6-9'),
    end: new Date('2025-6-13'),
    calendarType: 0,
    desc: '출장장소: 부산',
    type: 'businessTrip'
  },
  {
    id: 3,
    title: '외근',
    start: new Date('2025-6-13 08:00:00'),
    end: new Date('2025-6-13 10:30:00'),
    calendarType: 0,
    desc: '장소: 인천',
    type: 'workingOutside'
  },
  {
    id: 4,
    title: '외근',
    start: new Date('2025-6-18 14:00:00'),
    end: new Date('2025-6-18 16:00:00'),
    calendarType: 0,
    desc: '장소: 서초',
    type: 'workingOutside'    
  },
  {
    id: 5,
    title: '휴가',
    start: new Date('2025-6-27'),
    end: new Date('2025-6-27'),
    calendarType: 0,
    desc: '개인사유로 휴가신청합니다.',
    type: 'vacation'    
  }
  
]
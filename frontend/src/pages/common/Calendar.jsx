import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@mui/material';
import TextArea from '@mui/material/TextareaAutosize'; 

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TextField from '@mui/material/TextField';

async function fetchEvents(){
  console.log("FETCHING EVENTS FOR CALENDAR");
  return [
          {
              title: 'Team Meeting',
              start: new Date(2025, 3, 7, 10, 30), // April 7, 2025, 10:30 AM
              end: new Date(2025, 3, 7, 11, 30),
          },
          {
              title: 'Lunch Break',
              start: new Date(2025, 3, 8, 12, 0),
              end: new Date(2025, 3, 8, 13, 0),
              allDay: false,
          },
          {
              title: 'Conference',
              start: new Date(2025, 3, 9),
              end: new Date(2025, 3, 11),
              allDay: true,
          }
        ];
}


const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showPrompt, setShowPrompt] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchEvents().then((events) => {
      setEvents(events);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);

  const handleCalendarClick = (slotInfo) => {
    const title = prompt('Enter a title for your event:');
    if (title) {
      const newEvent = {
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        allDay: slotInfo.action === 'select',
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
  };

  const handleSaveEvent = () => {
    const newEvent = {
      title: eventTitle,
      start: new Date(startDate),
      end: new Date(endDate),
      allDay: false,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log("Event saved!");
    setShowPrompt(false);
  };

  const handleAddEvent = () => {
    setShowPrompt(true);
  };

  const closePrompt = () => {
    setShowPrompt(false);
  };

  return (
    <div>
      {showPrompt && (
        <EventPrompt 
          eventTitle={eventTitle}
          startDate={startDate}
          endDate={endDate}
          onTitleChange={setEventTitle}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
          onCancel={closePrompt}
          onSave={handleSaveEvent}
        />
      )}
      <div className='p-16 flex flex-col gap-2'>
        <div className='text-2xl font-bold ml-[3rem]'>Calendar</div>
        <Calendar  
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: '3rem' }}
          views={['month', 'week', 'day']}
          view={view}
          onView={(newView) => setView(newView)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          selectable
          onSelectSlot={handleCalendarClick}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#4C7E75',
              color: 'white',
            },
          })}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddEvent}
          style={{ marginLeft: '3rem', marginRight: '3rem', backgroundColor: '#4C7E75' }}
        >
          Add Event
        </Button>
      </div>
    </div>
  );
};


const EventPrompt = ({
  eventTitle,
  startDate,
  endDate,
  onTitleChange,
  onStartChange,
  onEndChange,
  onCancel,
  onSave
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 border border-4 border-black rounded shadow-md bg-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[20rem]">
      <h2 className="text-lg font-bold mx-auto">Add Event</h2>
      <TextField
        label="Event Title"
        placeholder="Enter event title"
        style={{ width: '100%' }}
        value={eventTitle}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <TextField
        label="Start Date & Time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        style={{ width: '100%' }}
        value={startDate}
        onChange={(e) => onStartChange(e.target.value)}
      />
      <TextField
        label="End Date & Time"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        style={{ width: '100%' }}
        value={endDate}
        onChange={(e) => onEndChange(e.target.value)}
      />
      <div className="flex justify-between">
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onSave}>Add</Button>
      </div>
    </div>
  );
};

export default MyCalendar;
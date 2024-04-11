import React from 'react';

const CheckAvailability = () => {
  return (
    <div className='check-availability'>
      <div className='auto-container'>
        <form className='form'>
          <div className='left-side'>
            <ul>
              <li>
                <input
                  type='text'
                  placeholder='Arrival Date'
                  className='datepicker'
                />
                <i className='far fa-calendar-alt'></i>
              </li>
              <li>
                <input
                  type='text'
                  placeholder='Departure Date'
                  className='datepicker'
                />
                <i className='far fa-calendar-alt'></i>
              </li>
              <li>
                <select>
                  <option data-display='Adults'>Adults</option>
                  <option value='1'>0 Adult</option>
                  <option value='2'>1 Adult</option>
                  <option value='3'>2 Adults</option>
                  <option value='4'>3 Adults</option>
                  <option value='5'>4 Adults</option>
                </select>
              </li>
              <li>
                <select>
                  <option data-display='Children'>Children</option>
                  <option value='1'>0 Children</option>
                  <option value='2'>1 Child</option>
                  <option value='3'>2 Children</option>
                  <option value='4'>3 Children</option>
                </select>
              </li>
            </ul>
          </div>
          <div className='right-side'>
            <button type='submit'>Check Availability</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckAvailability;

import React from 'react';

interface FormattedDateProps {
  date: Date;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ date }) => {
  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  );
};

export default FormattedDate;

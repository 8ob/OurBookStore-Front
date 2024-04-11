// import React, { useEffect } from 'react';
// import './RobotStyle.css';
// import '../../assets/css/style.css';
// const Robot: React.FC = () => {
//   useEffect(() => {
//     setTimeout(() => {
//       const script = document.createElement('script');
//       script.src =
//         'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
//       script.async = true;
//       document.body.appendChild(script);

//       // Clean up the script when the component unmounts
//       return () => {
//         document.body.removeChild(script);
//       };
//     }, 0);
//   }, []);

//   return (
//     <df-messenger
//       intent='WELCOME'
//       chat-title='島讀日二手書閣 歡迎你~'
//       agent-id='7ada3681-2b38-4824-a338-2ade10bdb26d'
//       language-code='zh-tw'
//     ></df-messenger>
//   );
// };

// export default Robot;

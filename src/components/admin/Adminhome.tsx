
// import React from 'react';

// interface AdminHomeProps {
//   currentRole: string;
//   IconComponent: string;
//   getRoleDisplayName: (role: string) => string;
// }

// const AdminHome: React.FC<AdminHomeProps> = ({ currentRole, IconComponent, getRoleDisplayName }) => {
//   return (
//     <div className={`bg-gradient-to-r ${currentRole.color} rounded-2xl p-8 mb-8 text-white`}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
//             <IconComponent className="w-8 h-8" />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold">{currentRole.title}</h2>
//             <p className="text-white/80 mt-1">
//               Manage Unit Managers and Users.
//             </p>
//           </div>
//         </div>
//         {currentRole.canCreate.length > 0 && (
//           <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2">
//             <span>Create {getRoleDisplayName(currentRole.canCreate[0])}</span>
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

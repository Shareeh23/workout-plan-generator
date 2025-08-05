import React from "react";
import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";
import "./UserTable.css";

const UserTable = ({ users, loading, error }) => {
  if (loading) return <div className="loading"><span className="loader"></span></div>;
  if (error) return <div className="error">{error}</div>;
  if (!users || users.length === 0)
    return <div className="no-users text-lg">No users found</div>;

  return (
    <div className="table-container">
      <table className="users-table">
        <thead>
          <tr>
            <th>
              <h4 className="th-text">Name</h4>
            </th>
            <th>
              <h4 className="th-text">Email</h4>
            </th>
            <th>
              <h4 className="th-text">Role</h4>
            </th>
            <th>
              <h4 className="th-text">Created</h4>
            </th>
            <th>
              <h4 className="th-text">Last Active</h4>
            </th>
            <th>
              <h4 className="th-text">Current Plan</h4>
            </th>
            <th>
              <h4 className="th-text">Training Days</h4>
            </th>
            <th>
              <h4 className="th-text">Plan Since</h4>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="text-lg">
                <div className="user-name">{user.name || "N/A"}</div>
              </td>
              <td className="text-lg">
                <div className="user-email">{user.email}</div>
              </td>
              <td>
                <span
                  className={`role-badge text-md ${
                    user.isAdmin ? "admin" : "user"
                  }`}
                >
                  {user.isAdmin ? "Admin" : "User"}
                </span>
              </td>
              <td className="text-lg">
                {user.createdAt
                  ? format(parseISO(user.createdAt), "MMM d, yyyy")
                  : "N/A"}
              </td>
              <td className="text-lg">
                {user.lastActivity && isValid(parseISO(user.lastActivity))
                  ? formatDistanceToNow(parseISO(user.lastActivity), {
                      addSuffix: true,
                    })
                  : "Never"}
              </td>
              <td className="text-lg">
                {user.workoutPlan?.planName || "No plan"}
              </td>
              <td className="text-lg">
                {user.workoutPlan?.trainingDays || "N/A"}
              </td>
              <td className="text-lg">
                {user.workoutPlan?.createdAt
                  ? format(parseISO(user.workoutPlan.createdAt), "MMM d, yyyy")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

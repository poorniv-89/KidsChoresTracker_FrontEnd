import React from 'react';

export default function ChildHistorySection({
  completedChores = [],
  pendingRewards = [],
  redeemedRewards = [],
  rejectedRewards = []
}) {
  return (
    <div className="history-dashboard-container">

      <div className="history-section">
        <h2 className="history-heading chores">✅ Completed Chores</h2>
        {completedChores.length === 0 ? (
          <p className="history-empty">No chores completed yet.</p>
        ) : (
          <ul className="history-list">
            {completedChores.map((chore, i) => (
              <li className="history-card" key={i}>
                <div className="history-title">{chore.choreTitle}</div>
                <div className="history-points">{chore.pointsEarned} pts</div>
                <div className={`history-status ${chore.status}`}>
                  {chore.status === 'approved'
                    ? '✅ Approved'
                    : chore.status === 'rejected'
                      ? (
                        <>
                          ❌ Rejected
                          <br />
                          <span className="rejection-comment">
                            Reason: {chore.rejectionComment || 'No reason provided'}
                          </span>
                        </>
                      )
                      : '⏳ Pending Approval'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="history-section">
        <h2 className="history-heading pending">🎁 Pending Reward Requests</h2>
        {pendingRewards.length === 0 ? (
          <p className="history-empty">No pending reward requests.</p>
        ) : (
          <ul className="history-list">
            {pendingRewards.map((reward, i) => (
              <li className="history-card" key={i}>
                <div className="history-title">{reward.title}</div>
                <div className="history-points">{reward.pointsCost} pts</div>
                <div className="history-status">
                  Requested on {new Date(reward.dateRequested).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="history-section">
        <h2 className="history-heading rejected">❌ Rejected Reward Requests</h2>
        {rejectedRewards.length === 0 ? (
          <p className="history-empty">No rejected rewards.</p>
        ) : (
          <ul className="history-list">
            {rejectedRewards.map((reward, i) => (
              <li className="history-card" key={i}>
                <div className="history-title">{reward.title}</div>
                <div className="history-points">{reward.pointsCost} pts</div>
                <div className="history-status">
                  Rejected on {new Date(reward.dateRequested).toLocaleDateString()}
                  {reward.rejectionComment && (
                    <div className="rejection-comment">
                      Reason: {reward.rejectionComment}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="history-section">
        <h2 className="history-heading redeemed">🏆 Redeemed Rewards</h2>
        {redeemedRewards.length === 0 ? (
          <p className="history-empty">No rewards redeemed yet.</p>
        ) : (
          <ul className="history-list">
            {redeemedRewards.map((reward, i) => (
              <li className="history-card" key={i}>
                <div className="history-title">{reward.title}</div>
                <div className="history-points">{reward.pointsCost} pts</div>
                <div className="history-status">
                  Redeemed on {new Date(reward.dateRedeemed).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
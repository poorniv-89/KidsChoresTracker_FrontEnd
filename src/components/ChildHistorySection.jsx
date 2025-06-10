import React from 'react';

export default function ChildHistorySection({ completedChores, pendingRewards, redeemedRewards }) {
    return (
        <div>
            <h2>Completed Chores</h2>
            {completedChores.length === 0 ? (
                <p>No chores completed yet.</p>
            ) : (
                <ul>
                    {completedChores.map((chore, i) => (
                        <li key={i}>
                            {chore.choreTitle} – {chore.pointsEarned} pts –{" "}
                            {chore.approved
                                ? "Approved"
                                : chore.rejected
                                    ? `Rejected (${chore.rejectionComment || "No reason"})`
                                    : "Pending Approval"}
                        </li>
                    ))}
                </ul>
            )}

            <h2>Pending Reward Requests</h2>
            {pendingRewards.length === 0 ? (
                <p>No pending reward requests.</p>
            ) : (
                <ul>
                    {pendingRewards.map((reward, i) => (
                        <li key={i}>
                            {reward.title} – {reward.pointsCost} pts – Requested on{" "}
                            {new Date(reward.dateRequested).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}

            <h2>Redeemed Rewards</h2>
            {redeemedRewards.length === 0 ? (
                <p>No rewards redeemed yet.</p>
            ) : (
                <ul>
                    {redeemedRewards.map((reward, i) => (
                        <li key={i}>
                            {reward.title} – {reward.pointsCost} pts – Redeemed on{" "}
                            {new Date(reward.dateRedeemed).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
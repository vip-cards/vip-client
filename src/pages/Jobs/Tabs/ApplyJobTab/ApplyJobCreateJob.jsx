export default function ApplyJobCreateJob() {
  return (
    <div className="hiring-tab-home-container">
      <div>carousel</div>
      <div className="jobs-cards-container">
        {[...Array(50)].map((k, i) => (
          <div key={i} className="job-card"></div>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";

function App() {
  const [jobIds, setJobIds] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // initial fetching of all job IDs
  useEffect(() => {
    fetchJobIds();
  }, []);

  // fethincg job details according to page number
  useEffect(() => {
    if (page > 0) {
      fetchJobs();
    }
  }, [page]);

  const fetchJobIds = async () => {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/jobstories.json"
    );
    const data = await response.json();
    setJobIds(data);
    setPage(1);
  };

  const fetchJobs = async () => {
    const jobsPerPage = 6;
    const start = (page - 1) * jobsPerPage;
    const end = start + jobsPerPage;

    const jobPromises = jobIds
      .slice(start, end)
      .map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
          (response) => response.json()
        )
      );

    const newJobs = await Promise.all(jobPromises);
    setJobs((prevJobs) => [...prevJobs, ...newJobs]);

    if (end >= jobIds.length) {
      setHasMore(false);
    }
  };

  const loadMoreJobs = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (jobs?.length > 0)
    return (
      <main className="font-sans p-5 bg-[#f6f6ef] min-h-screen">
        <div className="max-w-[400px] mx-auto">
          <h1 className="text-[#ff6601] font-bold text-xl mb-5">
            Hacker News Jobs Board
          </h1>

          {jobs?.map((singleJob) => {
            return <JobCard singleJob={singleJob} />;
          })}

          <button
            className={` ${
              hasMore ? "bg-[#ff6601]" : "bg-gray-500 cursor-not-allowed"
            }  text-white p-3 py-2 rounded-[4px] text-xs font-semibold`}
            onClick={loadMoreJobs}
          >
            Load more jobs
          </button>
        </div>
      </main>
    );
}

export default App;

export const JobCard = ({ singleJob }) => {
  return (
    <section
      key={singleJob.id}
      className="bg-white rounded-md mb-5 p-3 border-slate-300 border"
    >
      <h2 className="font-bold mb-1 text-sm">{singleJob?.title}</h2>
      <div className="flex gap-1 text-gray-700 text-xs">
        <div>By {singleJob?.by} </div>
        <div>&middot;</div>
        <div>{new Date(singleJob?.time * 1000).toLocaleString()}</div>
      </div>
    </section>
  );
};

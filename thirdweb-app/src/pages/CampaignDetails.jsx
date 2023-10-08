import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { Loader } from '../components';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { insertProcess, insertImageHash, getProcesses, getImageHash, contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [newProcess, setNewProcess] = useState('');
  const [newImageHash, setNewImageHash] = useState('');
  const [processes, setProcesses] = useState([]);
  const [imageHashes, setImageHashes] = useState([]);

  useEffect(() => {
    // Lấy thông tin chi tiết dự án khi component được tạo
    const fetchProjectDetails = async () => {
      try {
        // Gọi hàm contract để lấy thông tin dự án cụ thể (thay state.pId bằng project ID của bạn)
        const projectDetails = await contract.call('getProject', [state.pId]);

        // Gọi hàm contract để lấy các process và image hash của dự án
        const projectProcesses = await getProcesses(state.pId);
        const projectImageHashes = await getImageHash(state.pId);

        setProject(projectDetails);
        setProcesses(projectProcesses);
        setImageHashes(projectImageHashes);
      } catch (error) {
        console.error("Error fetching project details: ", error);
      }
    };

    if (state && state.pId) {
      fetchProjectDetails();
    }
  }, [contract, state, getProcesses, getImageHash]);

  const handleProcessInputChange = (event) => {
    setNewProcess(event.target.value);
  };

  const handleImageHashInputChange = (event) => {
    setNewImageHash(event.target.value);
  };

  const handleSaveProcess = async () => {
    try {
      setIsLoading(true);
      // Gọi hàm contract để thêm process (thay state.pId bằng project ID của bạn)
      await insertProcess(state.pId, newProcess);
      // Cập nhật danh sách các process
      const updatedProcesses = await getProcesses(state.pId);
      setProcesses(updatedProcesses);
      setNewProcess('');
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving process: ", error);
      setIsLoading(false);
    }
  };

  const handleSaveImageHash = async () => {
    try {
      setIsLoading(true);
      // Gọi hàm contract để thêm image hash (thay state.pId bằng project ID của bạn)
      await insertImageHash(state.pId, newImageHash);
      // Cập nhật danh sách các image hash
      const updatedImageHashes = await getImageHash(state.pId);
      setImageHashes(updatedImageHashes);
      setNewImageHash('');
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving image hash: ", error);
      setIsLoading(false);
    }
  };

  if (!state || (!state.pId && state.pId != 0)) {
    console.log("state: ", state)
    return (
      <div>
        <p className="white-input">Không tìm thấy thông tin dự án.</p>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="white-input">Chi tiết dự án</h1>
      {project && (
        <div>
          <p className="white-input">Owner: {project.owner}</p>
          <p className="white-input">Title: {project.title}</p>
        </div>
      )}

      <div>
        <h2 className="white-input">Processes</h2>
        <ul>
          {processes.map((process, index) => (
            <li key={index} className="white-input">{process}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Nhập process mới"
          value={newProcess}
          onChange={handleProcessInputChange}
        />
        <button onClick={handleSaveProcess} className="white-input">Lưu</button>
      </div>

      <div>
        <h2 className="white-input">Image Hashes</h2>
        <ul>
          {imageHashes.map((hash, index) => (
            <li key={index} className="white-input">{hash}</li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="Nhập image hash mới"
          value={newImageHash}
          onChange={handleImageHashInputChange}
        />
        <button onClick={handleSaveImageHash} className="white-input">Lưu</button>
      </div>
    </div>
  );
}

export default CampaignDetails;

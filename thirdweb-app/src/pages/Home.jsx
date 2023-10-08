import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const { address, contract, getProjects } = useStateContext();

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await getProjects();
    setProjects(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchProjects();
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title="All Projects"
      isLoading={isLoading}
      projects={projects}
    />
  )
}

export default Home

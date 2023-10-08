import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  // Replace with my own smart contract address
  const { contract } = useContract('0xadF086CBA18c31910658E0b228c4BDc4B354a9a7');
  const { mutateAsync: createProject } = useContractWrite(contract, 'createProject');
  const { mutateAsync: insertProcess } = useContractWrite(contract, 'insertProcess'); // Thêm hàm insertProcess
  const { mutateAsync: insertImageHash } = useContractWrite(contract, 'insertImageHash'); // Thêm hàm insertImageHash

  const address = useAddress();
  const connect = useMetamask();

  const publishProject = async (form) => {
    try {
      const data = await createProject({
				args: [
					address, // owner
					form.title, // title
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getProjects = async () => {
    const projects = await contract.call('getAllProjects');

    const parsedProjects = projects.map((project, i) => ({
      owner: project.owner,
      title: project.title,
      pId: i
    }));

    return parsedProjects;
  }

  const getUserProjects = async () => {
    const allProjects = await getProjects();

    const filteredProjects = allProjects.filter((project) => project.owner === address);

    return filteredProjects;
  }

  const _insertProcess = async (pId, process) => {
    try {
      const data = await insertProcess({
				args: [
					pId,
					process,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const _insertImageHash = async (pId, imageHash) => {
    try {
      const data = await insertImageHash({
				args: [
					pId,
					imageHash,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getProcesses = async (pId) => {
    try {
      const processes = await contract.call('getProcesses', [pId]);
      return processes;
    } catch (error) {
      console.error("Error getting processes: ", error);
    }
  }

  const getImageHash = async (pId) => {
    try {
      const imageHashes = await contract.call('getImagesHash', [pId]);
      return imageHashes;
    } catch (error) {
      console.error("Error getting image hashes: ", error);
    }
  }


  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createProject: publishProject,
        getProjects,
        getUserProjects,
        insertProcess: _insertProcess,
        insertImageHash: _insertImageHash,
        getProcesses,
        getImageHash
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);

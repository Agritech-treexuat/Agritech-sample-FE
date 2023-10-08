// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MyContract {
    struct Project {
        address owner;
        string title;
        address[] producers;
        uint256[] amounts;
        string[] processes;
        string[] imagesHash;
    }

    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public projectsByOwner; // Mapping từ địa chỉ owner đến danh sách các project của họ

    uint256 public numberOfProjects = 0;

    event ProjectCreated(uint256 indexed projectId, address indexed owner, string title);
    event ProducerInvited(uint256 indexed projectId, address indexed producer, uint256 amount);
    event ProcessInserted(uint256 indexed projectId, string process);
    event ImageHashInserted(uint256 indexed projectId, string imageHash);

    function createProject(address _owner, string memory _title) public returns (uint256) {
        Project storage project = projects[numberOfProjects];

        project.owner = _owner;
        project.title = _title;

        emit ProjectCreated(numberOfProjects, _owner, _title);

        projectsByOwner[_owner].push(numberOfProjects); // Thêm project mới vào danh sách của owner

        numberOfProjects++;

        return numberOfProjects - 1;
    }

    function inviteToProject(uint256 _id, address _producer_address, uint256 _amount) public {
        uint256 amount = _amount;
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can invite");

        project.producers.push(_producer_address);
        project.amounts.push(amount);

        emit ProducerInvited(_id, _producer_address, amount);
    }

    function insertProcess(uint256 _id, string memory _process) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert process");
        project.processes.push(_process);

        emit ProcessInserted(_id, _process);
    }

    function insertImageHash(uint256 _id, string memory _imageHash) public {
        Project storage project = projects[_id];

        require(project.owner == msg.sender, "Only owner of this project can insert image hash");
        project.imagesHash.push(_imageHash);

        emit ImageHashInserted(_id, _imageHash);
    }

    function getProducers(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Project storage project = projects[_id];
        return (project.producers, project.amounts);
    }

    function getProcesses(uint256 _id) public view returns (string[] memory) {
        Project storage project = projects[_id];
        return project.processes;
    }

    function getImagesHash(uint256 _id) public view returns (string[] memory) {
        Project storage project = projects[_id];
        return project.imagesHash;
    }

    function getProject(uint256 _id) public view returns (address, string memory, uint256, string[] memory, string[] memory) {
        Project storage project = projects[_id];
        return (project.owner, project.title, project.producers.length, project.processes, project.imagesHash);
    }

    function getNumberOfProjects() public view returns (uint256) {
        return numberOfProjects;
    }

    function getAllProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](numberOfProjects);

        for (uint256 i = 0; i < numberOfProjects; i++) {
            Project storage item = projects[i];

            allProjects[i] = item;
        }

        return allProjects;
    }

    function getProjectsByOwner(address owner) public view returns (uint256[] memory) {
        return projectsByOwner[owner];
    }
}

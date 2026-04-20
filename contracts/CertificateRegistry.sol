// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IssuerRegistry.sol";

contract CertificateRegistry {
    struct Certificate {
        bytes32 certHash;
        address issuer;
        string ipfsCid;
        uint256 timestamp;
        bool revoked;
    }
    
    IssuerRegistry public issuerRegistry;
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => uint256[]) public issuerCertificates;
    
    event CertificateIssued(bytes32 indexed certHash, address indexed issuer, string ipfsCid);
    event CertificateRevoked(bytes32 indexed certHash);
    
    constructor(address _issuerRegistry) {
        issuerRegistry = IssuerRegistry(_issuerRegistry);
    }
    
    function issueCertificate(bytes32 certHash, string calldata ipfsCid) external {
        require(issuerRegistry.verifyIssuer(msg.sender), "Not authorized issuer");
        require(certificates[certHash].timestamp == 0, "Certificate exists");
        
        certificates[certHash] = Certificate({
            certHash: certHash,
            issuer: msg.sender,
            ipfsCid: ipfsCid,
            timestamp: block.timestamp,
            revoked: false
        });
        
        issuerCertificates[msg.sender].push(certificates[certHash].timestamp);
        emit CertificateIssued(certHash, msg.sender, ipfsCid);
    }
    
    function verifyCertificate(bytes32 certHash) external view returns (
        bool valid,
        address issuer,
        string memory ipfsCid,
        bool revoked
    ) {
        Certificate memory cert = certificates[certHash];
        return (
            cert.timestamp > 0 && !cert.revoked,
            cert.issuer,
            cert.ipfsCid,
            cert.revoked
        );
    }
    
    function revokeCertificate(bytes32 certHash) external {
        Certificate storage cert = certificates[certHash];
        require(cert.issuer == msg.sender, "Not issuer");
        cert.revoked = true;
        emit CertificateRevoked(certHash);
    }
}

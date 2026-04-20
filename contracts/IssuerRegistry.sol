// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IssuerRegistry {
    mapping(address => bool) public isIssuer;
    address[] public issuers;
    
    event IssuerAdded(address indexed issuer);
    
    function addIssuer(address issuer) external {
        require(!isIssuer[issuer], "Already issuer");
        isIssuer[issuer] = true;
        issuers.push(issuer);
        emit IssuerAdded(issuer);
    }
    
    function verifyIssuer(address issuer) external view returns (bool) {
        return isIssuer[issuer];
    }
}

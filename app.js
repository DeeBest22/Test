const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');

let localStream;
let peerConnection;
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }  // STUN server
    ]
};

// Get the user's video and audio
async function startMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

// Create a new PeerConnection and handle the ICE candidates and tracks
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(iceServers);

    // Add local tracks to peer connection
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // When a remote track is received, display it in the remote video element
    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    // ICE candidate handling
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('New ICE candidate:', event.candidate);
            // Send the candidate to the remote peer via signaling server (not included in this example)
        }
    };
}

// Function to handle starting the call
async function startCall() {
    createPeerConnection();
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Offer created:', offer);

    // Send the offer to the remote peer via signaling server (not included here)
    // Then receive the answer and set it as the remote description
}

// Function to handle ending the call
function endCall() {
    peerConnection.close();
    peerConnection = null;
    remoteVideo.srcObject = null;
    console.log('Call ended');
}

// Event listeners
startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

// Start media when the page loads
startMedia();

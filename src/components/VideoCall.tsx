"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Settings, Users } from "lucide-react";
import io from "socket.io-client";

interface VideoCallProps {
  userId: string;
  partnerId: string;
  partnerName: string;
  onEndCall: () => void;
}

export default function VideoCall({ userId, partnerId, partnerName, onEndCall }: VideoCallProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    
    socketRef.current.emit('join-room', { userId, partnerId });
    
    socketRef.current.on('user-joined', handleUserJoined);
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handleIceCandidate);
    socketRef.current.on('call-ended', handleCallEnded);
    socketRef.current.on('incoming-call', handleIncomingCall);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [userId, partnerId]);

  const handleUserJoined = async (data: { userId: string }) => {
    console.log('User joined:', data.userId);
    setIsConnected(true);
    setCallStatus('connecting');
    
    try {
      await startLocalStream();
      const offer = await peerConnectionRef.current?.createOffer();
      if (offer) {
        await peerConnectionRef.current?.setLocalDescription(offer);
        socketRef.current.emit('offer', { offer, to: data.userId });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleOffer = async (data: { offer: RTCSessionDescriptionInit }) => {
    try {
      await startLocalStream();
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnectionRef.current?.createAnswer();
      if (answer) {
        await peerConnectionRef.current?.setLocalDescription(answer);
        socketRef.current.emit('answer', { answer, to: partnerId });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  const handleAnswer = async (data: { answer: RTCSessionDescriptionInit }) => {
    try {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
      setCallStatus('connected');
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => {
    try {
      await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const handleCallEnded = () => {
    setCallStatus('ended');
    setIsConnected(false);
    onEndCall();
  };

  const handleIncomingCall = () => {
    setIsIncomingCall(true);
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize peer connection
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnectionRef.current?.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            to: partnerId
          });
        }
      };

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera and microphone');
    }
  };

  const startCall = async () => {
    setCallStatus('connecting');
    await startLocalStream();
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    socketRef.current.emit('end-call', { to: partnerId });
    setCallStatus('ended');
    setIsConnected(false);
    onEndCall();
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const acceptCall = async () => {
    setIsIncomingCall(false);
    await startCall();
  };

  const declineCall = () => {
    setIsIncomingCall(false);
    socketRef.current.emit('decline-call', { to: partnerId });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative w-full h-full max-w-6xl max-h-screen">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Call Status Overlay */}
        {callStatus === 'connecting' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg">Connecting to {partnerName}...</p>
            </div>
          </div>
        )}

        {/* Incoming Call Overlay */}
        {isIncomingCall && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md">
              <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Incoming Call
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {partnerName} is calling you
              </p>
              <div className="flex gap-4">
                <button
                  onClick={acceptCall}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <Phone className="w-5 h-5 inline mr-2" />
                  Accept
                </button>
                <button
                  onClick={declineCall}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  <PhoneOff className="w-5 h-5 inline mr-2" />
                  Decline
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Toggle Button */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </button>

            {/* Settings Button */}
            <button className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Call Info */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
          <p className="text-white font-medium">{partnerName}</p>
          <p className="text-gray-300 text-sm">
            {callStatus === 'connected' ? 'Connected' : 
             callStatus === 'connecting' ? 'Connecting...' : 'Call ended'}
          </p>
        </div>
      </div>
    </div>
  );
}

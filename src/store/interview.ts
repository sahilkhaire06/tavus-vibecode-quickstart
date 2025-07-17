import { atom } from "jotai";
import { UserProfile, InterviewSession, InterviewStage } from "@/types/interview";

export const userProfileAtom = atom<UserProfile | null>(null);
export const interviewSessionAtom = atom<InterviewSession | null>(null);
export const currentStageAtom = atom<InterviewStage>('introductory');
export const isInterviewActiveAtom = atom<boolean>(false);
export const showCodeEditorAtom = atom<boolean>(false);
export const currentCodeAtom = atom<string>('');
export const selectedLanguageAtom = atom<string>('javascript');
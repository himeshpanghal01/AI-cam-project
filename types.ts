
export interface AnalysisResult {
  crowdCount: number;
  actions: ActionEvent[];
  attributes: string[];
  objects: string[];
  audioTranscription: string;
}

export interface ActionEvent {
  timestamp: string;
  description: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface UploadedFile {
  file: File;
  base64: string;
  type: string;
  previewUrl: string;
}

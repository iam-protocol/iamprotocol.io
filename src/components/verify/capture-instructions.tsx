type Props = {
  onBegin: () => void;
};

export default function CaptureInstructions({ onBegin }: Props) {
  return (
    <section
      role="region"
      aria-labelledby="capture-heading"
      className="min-h-screen bg-black flex items-center justify-center px-4"
    >
      <div className="max-w-xl w-full text-center space-y-6">
        <h2
          id="capture-heading"
          className="font-mono text-2xl text-cyan-400"
        >
          Verification
        </h2>

        <p className="text-gray-400 text-base">
          You&apos;ll speak a random phrase while tracing a shape on screen
        </p>

        <div className="space-y-4">
          <p className="text-gray-400 text-base">This takes 12 seconds</p>
          <p className="text-gray-400 text-base">
            Make sure your microphone and motion sensors are enabled
          </p>
        </div>

        <button
          type="button"
          onClick={onBegin}
          aria-label="Begin verification process"
          className="bg-cyan-500 text-black px-6 py-2 rounded-lg hover:bg-cyan-400 transition"
        >
          Begin
        </button>
      </div>
    </section>
  );
}

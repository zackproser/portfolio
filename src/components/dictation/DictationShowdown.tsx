import { AskAdvisorCTA } from '@/components/advisor/AskAdvisorCTA'
import { InlineAffiliateCTA } from '@/components/StickyAffiliateCTA'
import type { CompetitorArchetype } from '@/lib/dictation-cluster'
import { DictationShowdownImpression } from './DictationShowdownImpression'
import styles from './DictationShowdown.module.css'

interface DictationShowdownProps {
  campaign: string
  archetype: CompetitorArchetype
  competitorName: string
  competitorImageUrl?: string
  wisprFlowImageUrl?: string
}

const ARCHETYPE_LABELS: Record<CompetitorArchetype, string> = {
  recorder: 'Recorder → transcript later',
  'system-dictation': 'Mic key → literal text',
  'meeting-bot': 'Call bot → shared transcript',
  'ai-completion': 'Typed context → code suggestion',
  generic: 'Keyboard → text field',
}

const COMPETITOR_VERDICTS: Record<CompetitorArchetype, (name: string) => string> = {
  recorder: name => `${name} is a good fit when you want to capture audio and review a transcript later.`,
  'system-dictation': name => `${name} works well for short, literal dictation in a focused text field.`,
  'meeting-bot': name => `${name} is useful when a shared call transcript is the goal.`,
  'ai-completion': name => `${name} is useful when you want code suggestions built from typed context.`,
  generic: () => 'Traditional typing stays precise and familiar for short edits.',
}

function RecorderDiagram() {
  return (
    <div className={styles.recorderFlow} aria-hidden="true">
      <div className={styles.phoneFrame}>
        <span className={styles.deviceNotch} />
        <span className={styles.timer}>00:42</span>
        <div className={styles.waveform}>
          {[14, 26, 18, 38, 23, 32, 16, 29, 20].map((height, index) => (
            <span key={index} style={{ height }} />
          ))}
        </div>
        <span className={styles.recordButton}><i /></span>
      </div>
      <div className={styles.laterArrow}><span>Later</span><b>→</b></div>
      <div className={styles.transcriptSheet}>
        <span className={styles.sheetLabel}>Transcript</span>
        <i /><i /><i /><i className={styles.shortLine} />
      </div>
    </div>
  )
}

function SystemDictationDiagram() {
  return (
    <div className={styles.desktopFrame} aria-hidden="true">
      <div className={styles.windowBar}><i /><i /><i /></div>
      <div className={styles.fieldStack}>
        <span className={styles.fieldLabel}>Active field</span>
        <div className={styles.textField}>
          Literal words appear here<span className={styles.cursor} />
        </div>
        <div className={styles.dictationControls}>
          <kbd>Mic key</kbd><span>Speak punctuation</span>
        </div>
      </div>
    </div>
  )
}

function MeetingBotDiagram() {
  return (
    <div className={styles.meetingFrame} aria-hidden="true">
      <div className={styles.callGrid}>
        <span><i>AB</i></span><span><i>CD</i></span>
        <span className={styles.botTile}><i>BOT</i><b>Note bot joined</b></span>
      </div>
      <div className={styles.liveTranscript}>
        <span>Live transcript</span>
        <i /><i /><i className={styles.shortLine} />
      </div>
    </div>
  )
}

function AiCompletionDiagram() {
  return (
    <div className={styles.editorFrame} aria-hidden="true">
      <div className={styles.windowBar}><i /><i /><i /></div>
      <div className={styles.codeRows}>
        <span><b>1</b><i className={styles.codePurple} /></span>
        <span><b>2</b><i /></span>
        <span className={styles.ghostCode}><b>3</b><i /></span>
        <span className={styles.ghostCode}><b>4</b><i className={styles.codeShort} /></span>
      </div>
      <kbd className={styles.acceptKey}>Tab · accept</kbd>
    </div>
  )
}

function GenericDiagram() {
  return (
    <div className={styles.genericFrame} aria-hidden="true">
      <div className={styles.genericField}><i /><i /><i className={styles.shortLine} /><span className={styles.cursor} /></div>
      <div className={styles.keyboard}>
        {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
        <i className={styles.spacebar} />
      </div>
    </div>
  )
}

function CompetitorDiagram({ archetype }: { archetype: CompetitorArchetype }) {
  switch (archetype) {
    case 'recorder': return <RecorderDiagram />
    case 'system-dictation': return <SystemDictationDiagram />
    case 'meeting-bot': return <MeetingBotDiagram />
    case 'ai-completion': return <AiCompletionDiagram />
    default: return <GenericDiagram />
  }
}

function WisprFlowDiagram() {
  return (
    <div className={styles.flowFrame} aria-hidden="true">
      <div className={styles.appTabs}>
        <span className={styles.activeTab}>Mail</span><span>Docs</span><span>Chat</span>
        <b>Any app</b>
      </div>
      <div className={styles.flowCanvas}>
        <div className={styles.speechInput}>
          <span>“Send the revised brief tomorrow morning”</span>
          <div className={styles.speechTrail}><i /><i /><i /></div>
        </div>
        <div className={styles.formattedField}>
          <span className={styles.toLabel}>Message</span>
          <strong>Send the revised brief<br />tomorrow morning.</strong>
          <em>Formatted in place</em>
        </div>
      </div>
      <div className={styles.pushToTalk}><kbd>Hold key</kbd><span>Speak anywhere you type</span></div>
    </div>
  )
}

function Illustration({
  imageUrl,
  imageAlt,
  children,
}: {
  imageUrl?: string
  imageAlt: string
  children: React.ReactNode
}) {
  if (imageUrl) {
    // A real press-kit image can replace either schematic when one is supplied.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={styles.productImage} src={imageUrl} alt={imageAlt} />
  }
  return <>{children}</>
}

export function DictationShowdown({
  campaign,
  archetype,
  competitorName,
  competitorImageUrl,
  wisprFlowImageUrl,
}: DictationShowdownProps) {
  return (
    <figure className={`dictation-showdown ${styles.showdown}`} data-dictation-archetype={archetype}>
      <DictationShowdownImpression campaign={campaign} archetype={archetype} />

      <header className={styles.heading}>
        <span>Interaction map · illustration</span>
        <h3>How each tool turns speech into text</h3>
        <p>The useful difference is where the text appears and how much work remains afterward.</p>
      </header>

      <div className={styles.comparison}>
        <section className={styles.panel} aria-label={`${competitorName} interaction illustration`}>
          <div className={styles.panelHeading}>
            <strong>{competitorName}</strong>
            <span>{ARCHETYPE_LABELS[archetype]}</span>
          </div>
          <div className={styles.stage}>
            <Illustration
              imageUrl={competitorImageUrl}
              imageAlt={`${competitorName} product interface`}
            >
              <CompetitorDiagram archetype={archetype} />
            </Illustration>
          </div>
          <div className={styles.caption}><span>Illustration</span>{ARCHETYPE_LABELS[archetype]}</div>
        </section>

        <div className={styles.versus} aria-hidden="true">VS</div>

        <section className={`${styles.panel} ${styles.flowPanel}`} aria-label="WisprFlow interaction illustration">
          <div className={styles.panelHeading}>
            <strong>WisprFlow</strong>
            <span>Speech → formatted text in place</span>
          </div>
          <div className={styles.stage}>
            <Illustration imageUrl={wisprFlowImageUrl} imageAlt="WisprFlow product interface">
              <WisprFlowDiagram />
            </Illustration>
          </div>
          <div className={styles.caption}><span>Illustration</span>Formatted dictation in any app</div>
        </section>
      </div>

      <div className={styles.verdictStrip}>
        <div className={styles.verdict}>
          <span>{competitorName}</span>
          <p>{COMPETITOR_VERDICTS[archetype](competitorName)}</p>
        </div>
        <div className={`${styles.verdict} ${styles.flowVerdict}`}>
          <span>WisprFlow</span>
          <p>WisprFlow dictates into any app with AI formatting, and it is free to try.</p>
          <InlineAffiliateCTA product="wisprflow" campaign={campaign} />
        </div>
      </div>

      <AskAdvisorCTA
        from="dictation-cluster"
        variant="compact"
        className={styles.advisor}
      />

      <figcaption className={styles.figureNote}>
        Schematic interaction patterns; third-party interfaces and branding are intentionally omitted.
      </figcaption>
    </figure>
  )
}

export default DictationShowdown

# BZaudio Connection Lab — Compatibility Assessment

**Status:** Research scope only. No BZaudio live connection capability is certified by this document.  
**Policy:** Every model and capability must be verified independently with protocol documentation and real hardware before it is labeled supported.

## Target families

| Family | Product category | Current assessment |
|---|---|---|
| dLive | Digital mixing system | Model/protocol verification pending |
| Avantis | Digital mixing console | Model/protocol verification pending |
| SQ / SQ+ | Digital mixing consoles | Model/protocol verification pending |
| Qu | Digital mixing consoles | Model/protocol verification pending |
| CQ | Compact digital mixers | Model/protocol verification pending |
| GLD | Legacy digital mixing system | Legacy model verification pending |
| iLive | Legacy digital mixing system | Legacy model verification pending |
| AHM | Audio matrix processors | Model/protocol verification pending |
| ZED-R16 | USB/FireWire analog mixer family | Legacy connection assessment pending |
| ZED | Analog mixer family | Assessment pending; network control not assumed |
| MixWizard4 | Analog mixer family | Assessment pending; network control not assumed |
| XB | Broadcast mixer family | Assessment pending |
| Xone | DJ mixer family | Separate DJ workflow assessment pending |
| GR | Zone mixer family | Assessment pending |

This list is an evaluation roadmap, not a compatibility promise. Some analog or legacy models may not expose a network protocol suitable for the planned browser/companion workflows. Their inclusion means they will be assessed, not that network discovery or control will be available.

## Authoritative research references
- Allen & Heath hardware range: https://www.allen-heath.com/hardware/
- Allen & Heath Live Sound range: https://www.allen-heath.com/discovery/live-sound/
- Allen & Heath MIDI Control compatibility page: https://www.allen-heath.com/hardware/controllers/midi-control/

Allen & Heath's MIDI Control compatibility list is a useful research input for dLive, Avantis, AHM, SQ, Qu, CQ, GLD and ZED-R16. It does **not** certify BZaudio Connection Lab support, and it does not replace direct model/protocol testing.

## Capability gates
1. **Identify model:** verify exact model, firmware and connection interface.
2. **Discovery:** prove a safe discovery method and document network permissions.
3. **Monitoring:** verify read-only status/telemetry independently.
4. **Control:** separate explicit write/control permission, command validation, safe state, disconnect and recovery.
5. **Regression:** test each supported model/firmware combination and document limitations.

## Required evidence per model
- Exact model and firmware tested
- Protocol/documentation version and connection method
- Supported read operations and supported write operations
- Network permissions and security considerations
- Connection loss/recovery behavior
- Physical test date and result
- Known limitations and firmware caveats

Unknown, untested or unsupported capabilities must be shown as unverified or unavailable. Never infer support from a shared product family or a vendor's separate MIDI Control utility.

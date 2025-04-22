import type { Message } from "ai"

// Simple function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export const sampleResponses: Message[] = [
  {
    id: generateId(),
    role: "user",
    content: "What are the benefits of meditation?",
  },
  {
    id: generateId(),
    role: "assistant",
    content: `Meditation offers numerous scientifically-backed benefits for both mental and physical health:

1. **Stress Reduction**: Regular meditation practice has been shown to lower cortisol levels, the hormone associated with stress.

2. **Improved Focus and Concentration**: Meditation trains your mind to maintain attention, which can enhance productivity and learning.

3. **Better Emotional Regulation**: Studies indicate that meditation helps manage negative emotions and promotes positive psychological states.

4. **Enhanced Self-Awareness**: Mindfulness meditation encourages introspection, helping you develop a deeper understanding of yourself.

5. **Physical Health Benefits**: Research suggests meditation may help reduce blood pressure, improve sleep quality, and alleviate symptoms of certain chronic conditions.

References:
- Goyal, M., et al. (2014). Meditation Programs for Psychological Stress and Well-being. JAMA Internal Medicine, 174(3), 357-368.
- Davidson, R. J., & Kaszniak, A. W. (2015). Conceptual and methodological issues in research on mindfulness and meditation. American Psychologist, 70(7), 581-592.
- https://www.health.harvard.edu/blog/mindfulness-meditation-may-ease-anxiety-mental-stress-201401086967
- Tang, Y. Y., Hölzel, B. K., & Posner, M. I. (2015). The neuroscience of mindfulness meditation. Nature Reviews Neuroscience, 16(4), 213-225.`,
  },
  {
    id: generateId(),
    role: "user",
    content: "How does climate change affect biodiversity?",
  },
  {
    id: generateId(),
    role: "assistant",
    content: `Climate change poses significant threats to global biodiversity through multiple mechanisms:

1. **Habitat Loss**: Rising temperatures and changing precipitation patterns alter ecosystems faster than many species can adapt, leading to habitat degradation or loss.

2. **Range Shifts**: Many species are moving toward the poles or to higher elevations as their traditional habitats become unsuitable, disrupting established ecological communities.

3. **Phenological Mismatches**: Climate change disrupts the timing of seasonal events (like flowering, migration, or breeding), causing misalignments between interdependent species.

4. **Ocean Acidification**: Increased CO₂ absorption by oceans lowers pH levels, threatening marine organisms with calcium carbonate shells or skeletons, including coral reefs that support thousands of species.

5. **Extreme Weather Events**: More frequent and intense droughts, floods, and storms directly impact population sizes and can push vulnerable species toward extinction.

The IPCC estimates that 20-30% of plant and animal species assessed so far are at increased risk of extinction if global average temperatures rise by more than 1.5-2.5°C.

References:
- IPCC (2022). Climate Change 2022: Impacts, Adaptation and Vulnerability. Cambridge University Press, Cambridge, UK.
- Pecl, G. T., et al. (2017). Biodiversity redistribution under climate change: Impacts on ecosystems and human well-being. Science, 355(6332), 1389-1396.
- https://www.worldwildlife.org/threats/effects-of-climate-change
- Bellard, C., Bertelsmeier, C., Leadley, P., Thuiller, W., & Courchamp, F. (2012). Impacts of climate change on the future of biodiversity. Ecology Letters, 15(4), 365-377.
- Urban, M. C. (2015). Accelerating extinction risk from climate change. Science, 348(6234), 571-573.`,
  },
  {
    id: generateId(),
    role: "user",
    content: "What are the latest advancements in quantum computing?",
  },
  {
    id: generateId(),
    role: "assistant",
    content: `Recent advancements in quantum computing have been remarkable:

1. **Quantum Supremacy**: In 2019, Google claimed to achieve quantum supremacy when their 53-qubit Sycamore processor performed a specific calculation in 200 seconds that would take the world's most powerful supercomputer approximately 10,000 years.

2. **Error Correction Progress**: Researchers have made significant strides in quantum error correction, which is crucial for building fault-tolerant quantum computers. IBM's recent quantum roadmap highlights their progress toward error-corrected quantum computing.

3. **Increased Qubit Coherence Times**: Scientists have extended the coherence time of qubits, allowing quantum information to be preserved longer before decoherence occurs.

4. **Quantum Networking**: The development of quantum networks that can securely transmit quantum information between distant quantum processors is advancing, with successful demonstrations of quantum teleportation over fiber optic networks.

5. **Practical Quantum Algorithms**: Researchers continue to develop quantum algorithms with potential applications in cryptography, materials science, drug discovery, and optimization problems.

6. **Modular Quantum Computing**: Companies like IBM are pursuing modular approaches to quantum computing, connecting multiple quantum processors to scale up computational power.

These advancements suggest we're moving closer to practical quantum computers that could revolutionize fields like materials science, drug discovery, and cryptography.

References:
- Arute, F., et al. (2019). Quantum supremacy using a programmable superconducting processor. Nature, 574(7779), 505-510.
- IBM Research (2023). IBM Quantum Hardware Roadmap. IBM Quantum Computing Research.
- Zhong, H. S., et al. (2020). Quantum computational advantage using photons. Science, 370(6523), 1460-1463.
- https://www.nature.com/articles/s41586-019-1666-5
- https://research.ibm.com/blog/ibm-quantum-roadmap
- Preskill, J. (2018). Quantum Computing in the NISQ era and beyond. Quantum, 2, 79.`,
  },
]

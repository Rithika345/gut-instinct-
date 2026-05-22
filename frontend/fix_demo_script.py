import re
import json

path = '/Users/rithika/Desktop/Gut_instinct/MedXHackathon/gut-instinct-/frontend/demo-data.js'

with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []

for line in lines:
    # 4a. Rename cyp to enzyme
    line = re.sub(r'\bcyp:\s+', 'enzyme: ', line)
    
    # 4a. Values replacements
    if 'name: \'Escherichia coli\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: 'Oxidoreductases'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: 'Oxidoreductases'", line)
    if 'name: \'Bacteroides fragilis\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: 'Nitroreductases'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: 'Nitroreductases'", line)
    if 'name: \'Eggerthella lenta\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: 'Cgr2 reductase'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: 'Cgr2 reductase'", line)
    if 'name: \'Clostridium scindens\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: '7α-dehydroxylase'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: '7α-dehydroxylase'", line)
    if 'name: \'Enterococcus faecalis\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: 'Tyr. decarboxylase'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: 'Tyr. decarboxylase'", line)
        # 4b. Fix E. faecalis GUS flag
        line = re.sub(r'gus:\s*true', 'gus: false', line)
    if 'name: \'Pseudomonas aeruginosa\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: 'Monooxygenases'", line)
        line = re.sub(r"enzyme:\s*null", "enzyme: 'Monooxygenases'", line)
    if 'name: \'Bacteroides thetaiotaomicron\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    if 'name: \'Bacteroides vulgatus\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    if 'name: \'Klebsiella pneumoniae\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    if 'name: \'Clostridium bolteae\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    if 'name: \'Prevotella copri\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    if 'name: \'Lactobacillus rhamnosus\'' in line:
        line = re.sub(r"enzyme:\s*'[^']+'", "enzyme: null", line)
    
    # 4c. Edge types
    line = re.sub(r"type:\s*'cyp'", "type: 'enz'", line)
    if "taxon: 'efaec'" in line and "type: 'gus'" in line:
        line = line.replace("type: 'gus'", "type: 'enz'")

    # 4d. Interaction type
    line = line.replace("interaction_type: 'ortholog_degradation'", "interaction_type: 'enzymatic_degradation'")

    # 4e. Components
    line = re.sub(r'components:\s*\{\s*ortho:', 'components: { enz:', line)

    # 4f. Global string replacements
    line = line.replace("CYP2D6-like ortholog", "drug-metabolizing enzyme activity")
    line = line.replace("CYP2D6-like reductase", "oxidoreductase activity")
    line = line.replace("CYP2D6-like activity", "drug-metabolizing enzyme activity")
    line = line.replace("CYP2C19-like ortholog", "drug-metabolizing enzyme activity")
    line = line.replace("CYP2C19-like activity", "drug-metabolizing enzyme activity")
    line = line.replace("CYP3A4-like 7α-dehydroxylase", "bile acid 7α-dehydroxylase (bai operon)")
    line = line.replace("CYP3A4-like activity", "bile acid 7α-dehydroxylase activity")
    line = line.replace("CYP ortholog burden", "enzymatic degradation burden")
    line = line.replace("CYP ortholog", "enzymatic degradation")
    line = line.replace("bacterial ortholog", "bacterial enzyme")
    line = line.replace("ortholog activity", "enzyme activity")
    line = line.replace("ortholog pressure", "enzymatic pressure")
    line = line.replace("ortholog burden", "enzymatic burden")
    line = line.replace("CYP2B6-like activity", "predicted xenobiotic metabolism")

    # E. faecalis specific
    line = line.replace(", E. faecalis", "")
    line = line.replace("E. faecalis,", "")
    line = line.replace("and E. faecalis", "")
    line = line.replace("E. faecalis (9.2%)", "")
    line = line.replace(", Enterococcus faecalis", "")
    line = line.replace("Enterococcus faecalis,", "")
    line = line.replace("Enterococcus faecalis (9.2%), ", "")
    line = line.replace("Enterococcus faecalis (9.2%)", "")

    # Clean up any trailing commas from deleting items in a list
    line = line.replace(", ,", ",")
    line = line.replace("  ", " ")
    
    # "CYP2D6-like activity (Tier 2) + strong GUS (Tier 1)" -> already replaced some parts, but let's just make sure.
    # Actually, E. faecalis concern was completely rewritten in a previous step to:
    # "Tyrosine decarboxylase (L-DOPA metabolism) — NOT a confirmed GUS producer (has beta-galactosidase, not beta-glucuronidase); no validated enzymatic degradations; tyramine production is the primary concern"
    # So we don't need to touch it if it's already fixed.

    # B. fragilis specific fixes
    # "(Tier 2, ~45% identity)" -> "nitroreductase/azoreductase activity (Zimmermann 2019)"
    # We already replaced "CYP2D6-like reductase", so it might look like "oxidoreductase activity (Tier 2, ~45% identity)"
    line = re.sub(r'\(Tier 2, ~45% identity\)', 'nitroreductase/azoreductase activity (Zimmermann 2019)', line)
    
    # E. coli specific fixes
    # "oxidoreductase activity (Tier 1, confirmed)" -> "oxidoreductase drug-metabolizing activity (Zimmermann 2019)"
    line = line.replace("oxidoreductase activity (Tier 1, confirmed)", "oxidoreductase drug-metabolizing activity (Zimmermann 2019)")
    line = re.sub(r'~40% identity', '', line)
    line = re.sub(r'\(~40% identity\)', '', line)

    # Limitations caveats
    old_caveat = "Sequence homology does not guarantee functional equivalence. Bacterial orthologs may not metabolize drugs identically to human enzymes."
    new_caveat = "Bacterial drug-metabolizing enzymes operate through different mechanisms than human CYP450 enzymes. Functional activity predictions are based on documented in vitro metabolism (Zimmermann 2019), not sequence homology."
    line = line.replace(old_caveat, new_caveat)
    
    # Fix double spaces created by deletions
    line = line.replace("  ", " ")

    new_lines.append(line)

with open(path, 'w') as f:
    f.writelines(new_lines)

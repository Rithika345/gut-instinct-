import re

with open('frontend/demo-data.js', 'r') as f:
    content = f.read()

# Fix Taxa arrays
content = re.sub(r"(name:\s*'Escherichia coli',\s*phylum:\s*'Proteobacteria',\s*abundance:\s*[\d.]+,\s*gus:\s*true,\s*cyp:\s*)'CYP2D6/2C19'", r"\1'Oxidoreductases'", content)
content = re.sub(r"(name:\s*'Bacteroides fragilis',\s*phylum:\s*'Bacteroidetes',\s*abundance:\s*[\d.]+,\s*gus:\s*true,\s*cyp:\s*)'CYP2D6'", r"\1'Nitroreductases'", content)
content = re.sub(r"(name:\s*'Enterococcus faecalis',\s*phylum:\s*'Firmicutes',\s*abundance:\s*[\d.]+,\s*gus:\s*)true(,\s*cyp:\s*)'CYP2D6'", r"\1false\2null", content)
content = re.sub(r"(name:\s*'Eggerthella lenta',\s*phylum:\s*'Actinobacteria',\s*abundance:\s*[\d.]+,\s*gus:\s*false,\s*cyp:\s*)'CYP2D6'", r"\1'Cgr2 reductase'", content)

# Remove efaec nodes and edges
content = re.sub(r"\s*\{\s*id:\s*'efaec'.*?\n", "\n", content)
content = re.sub(r"\s*\{\s*taxon:\s*'efaec'.*?\n", "\n", content)

# Fix recommendation text (broad)
content = content.replace("E. coli CYP2D6-like ortholog", "E. coli oxidoreductase/nitroreductase activity (non-CYP, Zimmermann 2019)")
content = content.replace("CYP2D6-like ortholog", "drug-metabolizing enzyme activity")
content = content.replace("CYP2D6-like reductase", "oxidoreductase (non-CYP, Zimmermann 2019)")
content = content.replace("CYP2D6/2C19", "oxidoreductases/nitroreductases")
content = content.replace("CYP ortholog", "enzymatic degradation")

# Fix E. faecalis text
content = content.replace("CYP2D6-like activity (Tier 2) + strong GUS (Tier 1, 7.4%); also produces tyramine", "tyrosine decarboxylase activity (Tier 2); also produces tyramine")
content = content.replace("CYP2D6-like activity (Tier 2) + strong GUS (Tier 1, 9.2%); tyrosine decarboxylase produces tyramine", "tyrosine decarboxylase activity (Tier 2); produces tyramine")
content = content.replace("Enterococcus faecalis (7.4%)", "Enterococcus faecalis (7.4%, non-GUS)")
content = content.replace("Enterococcus faecalis (9.2%)", "Enterococcus faecalis (9.2%, non-GUS)")
content = content.replace("Enterococcus faecalis (6.2%)", "Enterococcus faecalis (6.2%, non-GUS)")
content = content.replace("'Enterococcus faecalis', ", "") # removing from taxa_involved arrays
content = content.replace(", 'Enterococcus faecalis'", "")

# Fix Caveats
old_caveat = "'The current knowledge base is limited"
new_caveat = "'Most bacterial drug metabolism in the gut occurs via non-CYP enzyme families (oxidoreductases, nitroreductases, hydrolases) rather than direct CYP450 orthologs.',\n        'No prospective clinical trial has yet demonstrated that microbiome-guided psychiatric prescribing improves patient outcomes.',\n        " + old_caveat
content = content.replace(old_caveat, new_caveat)

with open('frontend/demo-data.js', 'w') as f:
    f.write(content)


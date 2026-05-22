with open('demo-data.js', 'r') as f:
    content = f.read()

# Fix 1: C. scindens CYP3A4-like 4 places
content = content.replace("CYP3A4-like 7-alpha-dehydroxylase", "bile acid 7α-dehydroxylase (bai operon)")
content = content.replace("highest single-taxon CYP3A4 enzymatic pressure", "highest single-taxon enzymatic pressure")
content = content.replace("CYP3A4 pressure across all demos", "enzymatic pressure across all demos")

# Fix 2: E. coli CYP2C19-like line 153
content = content.replace("E. coli CYP2C19-like", "E. coli oxidoreductase activity")

# Fix 3: CYP3A4 ortholog threat
content = content.replace("CYP3A4 ortholog threat", "enzymatic threat")

# Fix 4: heavy CYP3A4 pressure
content = content.replace("heavy CYP3A4 pressure from Clostridium scindens", "heavy bile acid 7α-dehydroxylase pressure from Clostridium scindens")

# Fix 5: Clarify human CYP pathways vs bacterial.
content = content.replace("CYP3A4 pathway pressure reverses", "enzymatic pathway pressure reverses")
content = content.replace("// C. scindens — CYP3A4 + GUS", "// C. scindens — 7α-dehydroxylase + GUS")
content = content.replace("// C. bolteae — CYP2D6 + GUS", "// C. bolteae — enzyme + GUS")
content = content.replace("// B. fragilis — CYP2D6 + GUS", "// B. fragilis — enzyme + GUS")

# Fix 6: cross-reactivity with drug substrates
content = content.replace("has documented cross-reactivity with drug substrates", "may affect drug metabolism through bile acid-mediated pathway alterations")

with open('demo-data.js', 'w') as f:
    f.write(content)

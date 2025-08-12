import React, { useState, useCallback, useMemo } from 'react';
import { fetchRepoContents, parseOwnerRepo } from './api/github.js';
import { analyzeFiles } from './analysis/analyze.js';
import { ThreeScene } from './components/ThreeScene.jsx';
import './App.css';

function App() {
  const [url, setUrl] = useState('https://github.com/freeCodeCamp/freeCodeCamp');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const runAnalysis = useCallback(async (overrideUrl) => {
    setStatus('loading');
    try {
      const repoUrl = overrideUrl || url;
      const { owner, repo } = parseOwnerRepo(repoUrl);
      const res = await fetchRepoContents(owner, repo, token);
      const analyzed = analyzeFiles(res.files || []);
      const pathSet = new Set(analyzed.map(a => a.path));
      const builtLinks = [];
      analyzed.forEach(a => {
        (a.imports || []).forEach(imp => {
          const target = Array.from(pathSet).find(p => p.includes(imp) || imp.includes(p.split('/').slice(-1)[0]));
            if (target) builtLinks.push({ source: a.path, target });
        });
      });
      setNodes(analyzed);
      setLinks(builtLinks);
      setStatus('done');
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  }, [url, token]);

  const filteredNodes = useMemo(() => {
    if (!query.trim()) return nodes;
    const q = query.toLowerCase();
    return nodes.filter(n => n.path.toLowerCase().includes(q));
  }, [nodes, query]);

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Code Architect — MVP</h2>
        <div className="card">
          <label>Public GitHub repo URL</label>
          <input className="input" value={url} onChange={e => setUrl(e.target.value)} />
          <div style={{ height: 8 }} />
            <label>Optional GitHub token (for higher rate limits)</label>
          <input className="input" value={token} onChange={e => setToken(e.target.value)} />
          <div className="controls">
            <button className="button" onClick={() => runAnalysis()}>Analyze</button>
            <button className="button" onClick={() => {
              setUrl('https://github.com/facebook/react');
              setNodes([]); setLinks([]); setSelected(null); setStatus('idle');
            }}>Reset</button>
          </div>
        </div>
        <div className="card">
          <h4>Status</h4><p>{status}</p>
          <h4>Repo stats</h4>
          <p>Files analyzed: {nodes.length}</p>
          <p>Links: {links.length}</p>
        </div>
        <div className="card">
          <h4>Selected file</h4>
          {selected ? (
            <div>
              <p><strong>{selected.path}</strong></p>
              <p>LOC: {selected.loc}</p>
              <p>Complexity: {selected.complexity}</p>
              <details style={{ whiteSpace:'pre-wrap' }}>
                <summary>Snippet</summary>
                <pre style={{ maxHeight:200, overflow:'auto' }}>{selected.content?.slice(0, 2000)}</pre>
              </details>
            </div>
          ) : <p>Click a building in the 3D view</p>}
        </div>
        <div className="card">
          <h4>Legend</h4>
          <div className="legend">
            <span><i style={{background:'#60a5fa'}} /> Low complexity</span>
            <span><i style={{background:'#facc15'}} /> Medium</span>
            <span><i style={{background:'#ff6b6b'}} /> High</span>
          </div>
          <small>Height = LOC (log scale)</small>
        </div>
        <div style={{ height:40 }} />
        <small>Built as an MVP — improve parsing & backend for more depth.</small>
      </div>
      <div className="canvasWrap">
        <ThreeScene nodes={filteredNodes} links={links} onFocus={d => setSelected(d || null)} />
      </div>
    </div>
  );
}

export default App;

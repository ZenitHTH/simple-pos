# Remote Desktop Migration Guide: Parsec to Sunshine/Moonlight
**Target OS:** Fedora GNOME (Wayland)
**Hardware:** Intel i7-13700KF | AMD Radeon RX 7600

This guide replaces the unstable Windows 11 + Parsec environment with a high-performance, open-source Linux hosting solution.

---

## 🖥️ Server Side (Fedora Host)

### 1. Unlock Hardware Encoding (AMD RX 7600)
Fedora's default drivers disable proprietary codecs. You must install the full versions to use the RX 7600's encoders.

```bash
# Enable RPM Fusion
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Swap to 'Freeworld' drivers for VA-API (HEVC/AV1)
sudo dnf swap mesa-va-drivers mesa-va-drivers-freeworld
sudo dnf install libva-utils
```
*Verify with `vainfo | grep HEVC`—you should see encoding profiles.*

### 2. Install Sunshine
```bash
sudo dnf copr enable liamdawe/sunshine
sudo dnf install sunshine
```

### 3. Configure Input Permissions
Sunshine needs permission to create virtual input devices (UInput).

```bash
# Create input group and add yourself
sudo groupadd input
sudo usermod -aG input $USER

# Add UDev rule for virtual keyboard/mouse
echo 'KERNEL=="uinput", GROUP="input", MODE="0660", OPTIONS+="static_node=uinput"' | sudo tee /etc/udev/rules.d/60-sunshine.rules

# Reboot to apply
sudo reboot
```

### 4. Setup Tailscale (Remote Access)
Replaces Parsec's login system for connecting from outside your local network.

```bash
sudo dnf config-manager --add-repo https://pkgs.tailscale.com/stable/fedora/tailscale.repo
sudo dnf install tailscale
sudo systemctl enable --now tailscaled
sudo tailscale up
```

### 5. Finalize Sunshine Web UI
1. Run `sunshine` in terminal.
2. Open `https://localhost:47990`.
3. **Configuration Tab:** 
   - **Encoder:** `vaapi`
   - **Video Codec:** `AV1` (Best) or `HEVC`
4. **PIN Tab:** Use this later to pair your client.

---

## 📱 Client Side (Remote Device)

### 1. Install Moonlight
Download from [Moonlight-Stream.org](https://moonlight-stream.org/) for Windows, macOS, Android, or iOS.

### 2. Connect via Tailscale
1. Install Tailscale on the client and log in.
2. Open Moonlight.
3. If the Fedora machine doesn't appear, click **Add PC (+)** and type the **Tailscale IP** of your Fedora host.

### 3. Pairing
1. Click your Fedora PC icon in Moonlight.
2. Note the **4-digit PIN**.
3. Enter this PIN in the **Sunshine Web UI** (PIN Tab) on the Fedora machine.

### 4. Optimized Client Settings (Gear Icon)
*   **Resolution:** Match host monitor (e.g., 1080p).
*   **Frame Rate:** 60 FPS.
*   **Video Codec:** **Force AV1** (The RX 7600 is an AV1 beast).
*   **Mouse:** Check "Optimize mouse for remote desktop".
*   **Keys:** Check "Capture system keys" (for Alt+Tab).

---

## ⚡ Comparison vs Parsec
| Feature | Parsec (Windows) | Sunshine (Fedora) |
| :--- | :--- | :--- |
| **Color Depth** | 4:2:0 (Often blurry) | **4:4:4 Full Color Support** |
| **Stability** | Degrades after 48h | Solid for months |
| **Codec** | H.264 / HEVC | **AV1 (Modern & Sharp)** |
| **Control** | Proprietary | 100% User Owned |

---
*Created for Vibe POS Development Environment Optimization.*

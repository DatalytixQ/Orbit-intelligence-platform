import os
import zipfile
import paramiko
import time

def zip_directory(folder_path, zip_path):
    print(f"Zipping {folder_path}...")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            # Excluir directorios pesados e irrelevantes
            dirs[:] = [d for d in dirs if d not in ['node_modules', 'venv', '.git', '.vs', '__pycache__']]
            for file in files:
                if file.endswith('.zip') or file.endswith('.db') or file == '.env':
                    continue # No subir la base de datos local ni el .env local
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)

def deploy():
    host = "177.7.57.19"
    port = 22
    username = "root"
    password = "P494DUkVOl#7A-fU"
    
    local_dir = r"C:\Users\dario\erp-intelligence-foundation"
    zip_file = "orbit_deploy.zip"
    
    zip_directory(local_dir, zip_file)
    
    print("Connecting to VPS via SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(host, port, username, password)
    
    print("Uploading zip file to /root/Orbit-intelligence-platform...")
    sftp = ssh.open_sftp()
    
    # Create directory
    stdin, stdout, stderr = ssh.exec_command("mkdir -p /root/Orbit-intelligence-platform")
    stdout.channel.recv_exit_status()
    
    sftp.put(zip_file, "/root/Orbit-intelligence-platform/orbit_deploy.zip")
    sftp.close()
    
    print("Unzipping and setting up...")
    commands = [
        "cd /root/Orbit-intelligence-platform",
        "apt-get update && apt-get install -y unzip",
        "unzip -o orbit_deploy.zip",
        "rm orbit_deploy.zip",
        # Generar un .env básico de producción
        "echo 'POSTGRES_USER=orbit_admin' > .env",
        "echo 'POSTGRES_PASSWORD=ProSecurePassword2026!' >> .env",
        "echo 'POSTGRES_DB=orbit_db' >> .env",
        "echo 'DATABASE_URL=postgres://orbit_admin:ProSecurePassword2026!@postgres:5432/orbit_db' >> .env",
        "echo 'JWT_SECRET=S3cr3tPr0d2026Orbit#!' >> .env",
        "echo 'INTERNAL_API_KEY=n8n_secret_token_123' >> .env",
        # Configurar firewall
        "ufw allow 22/tcp",
        "ufw allow 80/tcp",
        "ufw allow 443/tcp",
        "ufw allow 3000/tcp",
        "ufw allow 5678/tcp",
        "ufw --force enable",
        # Levantar contenedores
        "docker compose up -d --build"
    ]
    
    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status()
        print(stdout.read().decode('utf-8'))
        err = stderr.read().decode('utf-8')
        if err:
            print(f"Stderr: {err}")
            
    ssh.close()
    print("Deployment successful!")

if __name__ == "__main__":
    deploy()
